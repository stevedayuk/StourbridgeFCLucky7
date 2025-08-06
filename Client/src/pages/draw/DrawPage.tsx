import DrawHeader from "../../draw/DrawHeader.tsx";

import styles from './DrawPage.module.css';
import DrawContent from "../../draw/DrawContent.tsx";
import StartDraw from "../../draw/StartDraw.tsx";
import {useState} from "react";
import type {CurrentDrawInfo} from "../../types/CurrentDrawInfo.ts";
import {post} from "../../util/http.ts";

type DrawPageProps = {
    isTest?: boolean;
};

export default function DrawPage(props: DrawPageProps) {
    const [isDrawing, setIsDrawing] = useState(false);

    async function startDraw(drawMonth: number, drawYear: number) {
        const apiUrl = import.meta.env.VITE_API_URL + "/draws/start";
        const body : CurrentDrawInfo = {
            drawMonth: drawMonth,
            drawYear: drawYear,
        }

        await post(apiUrl, body);

        setIsDrawing(true);
    }

    return <div className={styles.page}>
        <DrawHeader />
        {!isDrawing && <StartDraw isTest={props.isTest} startDraw={startDraw} />}
        {isDrawing && <DrawContent isTest={props.isTest} />}
    </div>
}