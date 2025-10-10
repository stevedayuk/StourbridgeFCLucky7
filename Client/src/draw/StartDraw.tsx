import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { ApiService } from "../services/apiService.ts";
import type {CurrentDrawInfo} from "../types/CurrentDrawInfo.ts";
import styles from './StartDraw.module.css';
import {useEffect, useState} from "react";
import Spinner from "../layouts/Spinner.tsx";

type ExportFormProps = {
    isTest?: boolean;
    startDraw: (drawInfo: CurrentDrawInfo) => void;
}

export default function StartDraw(props: ExportFormProps) {
    const [drawInfo, setDrawInfo] = useState<CurrentDrawInfo | null>(null);
    const [currentDrawMonthName, setCurrentDrawMonthName] = useState('');

    async function populateCurrentDrawInfo() {
        const endpointUrl = "/draws/current-info";
        const currentDrawInfo = await ApiService.get<CurrentDrawInfo>(endpointUrl);

        const currentDrawDate = new Date(currentDrawInfo.drawYear, currentDrawInfo.drawMonth - 1, 1);
        setDrawInfo(currentDrawInfo);
        setCurrentDrawMonthName(currentDrawDate.toLocaleString('default', { month: 'long' }));
    }

    useEffect(() => {
        populateCurrentDrawInfo();
    }, []);

    if (!drawInfo) {
        return <Spinner />;
    }

    const drawButtonLabel = props.isTest
        ? 'Start Test Draw'
        : drawInfo.inProgress
            ? 'Continue Draw'
            : 'Start Draw';

    return <div className={styles.startDraw}>
        {props.isTest && <div>
            <h1>Start New Test Draw</h1>
            <p>You are about to start a new test draw.</p>
            <Alert variant={"info"}>
                This draw will use the current active user data, but will not save the selected winners to the database.
            </Alert>
        </div>}

        {!props.isTest && !drawInfo.inProgress && <div>
            <h1>Start New Draw</h1>
            <p>You're about to start a new draw for {currentDrawMonthName} {drawInfo.drawYear}.</p>
            <Alert variant={"warning"}>
                After selecting 'Start Draw' below, don't forget to go into Full Screen mode before displaying the draw screen to the public.
            </Alert>
        </div>}

        {!props.isTest && drawInfo.inProgress && <div>
            <h1>Continue Draw</h1>
            <p>You're about to continue the draw for {currentDrawMonthName} {drawInfo.drawYear}</p>
            <Alert variant={"danger"}>
                Any already drawn winners will be already populated and the draw will continue with the next un-drawn prize.
            </Alert>
            <Alert variant={"warning"}>
                After selecting 'Start Draw' below, don't forget to go into Full Screen mode before displaying the draw screen to the public.
            </Alert>
        </div>}

        <Button variant="danger"
                onClick={() => props.startDraw(drawInfo)}
                size={"lg"}>
            {drawButtonLabel}
        </Button>
    </div>;
}