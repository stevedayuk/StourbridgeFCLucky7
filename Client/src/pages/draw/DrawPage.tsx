import AdminHeader from "../../admin/AdminHeader.tsx";

import styles from './DrawPage.module.css';
import DrawContent from "../../draw/DrawContent.tsx";
import StartDraw from "../../draw/StartDraw.tsx";
import {useState} from "react";
import type {CurrentDrawInfo} from "../../types/CurrentDrawInfo.ts";
import { ApiService } from '../../services/apiService.ts';
import DrawResults from "../../draw/DrawResults.tsx";

type DrawPageProps = {
    isTest?: boolean;
};

export default function DrawPage(props: DrawPageProps) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawComplete, setIsDrawComplete] = useState(false);
    const [drawMonthName, setDrawMonthName] = useState('');
    const [drawYear, setDrawYear] = useState(0);

    async function startDraw(currentDrawInfo: CurrentDrawInfo) {
        if (currentDrawInfo.inProgress) {
            setIsDrawing(true);
            return;
        }

        const endpointUrl = "/draws/start";
        await ApiService.post(endpointUrl, currentDrawInfo);

        setIsDrawing(true);
    }

    async function completeDraw(drawMonthName: string, drawYear: number) {
        setDrawMonthName(drawMonthName);
        setDrawYear(drawYear);
        setIsDrawComplete(true);
    }

    return (<>
        <div className={styles.page}>
            <AdminHeader mode={"draw"} />
            {!isDrawing && <StartDraw isTest={props.isTest} startDraw={startDraw} />}
            {isDrawing && !isDrawComplete && <DrawContent isTest={props.isTest} completeDraw={completeDraw} />}
            {isDrawComplete && <DrawResults drawMonthName={drawMonthName} drawYear={drawYear} />}
        </div>
    </>)
}