import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import {get} from "../util/http.ts";
import type {CurrentDrawInfo} from "../types/CurrentDrawInfo.ts";
import styles from './StartDraw.module.css';
import {useEffect, useState} from "react";
import Spinner from "../layouts/Spinner.tsx";

type ExportFormProps = {
    startDraw: () => void;
}

export default function StartDraw(props: ExportFormProps) {
    const [drawInfo, setDrawInfo] = useState<CurrentDrawInfo | null>(null);
    const [currentDrawMonthName, setCurrentDrawMonthName] = useState('');

    async function populateCurrentDrawInfo() {
        const apiUrl = import.meta.env.VITE_API_URL + "/draws/current-info";
        const currentDrawInfo = (await get(apiUrl) as CurrentDrawInfo);

        const currentDrawDate = new Date(currentDrawInfo.drawYear, currentDrawInfo.drawMonth, 1);
        setDrawInfo(currentDrawInfo);
        setCurrentDrawMonthName(currentDrawDate.toLocaleString('default', { month: 'long' }));
    }

    useEffect(() => {
        populateCurrentDrawInfo();
    }, []);

    if (!drawInfo) {
        return <Spinner />;
    }

    return <div className={styles.startDraw}>
        <h1>Start New Draw</h1>
        <p>You're about to start a new draw for {currentDrawMonthName} {drawInfo.drawYear}.</p>
        <Alert variant="warning">
            After selecting 'Start Draw' below, don't forget to go into Full Screen mode before displaying the draw screen to the public.
        </Alert>
        <Button variant="danger" onClick={() => props.startDraw()} size={"lg"}>Start Draw</Button>
    </div>;
}