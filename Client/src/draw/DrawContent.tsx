import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {useAppDispatch} from "../store/hooks.ts";
import {useEffect, useState} from "react";
import { ApiService } from "../services/apiService.ts";
import type {CurrentDraw} from "../types/CurrentDraw.ts";
import {populateDrawEntries} from "../store/current-draw-slice.ts";
import DrawControl from "./DrawControl.tsx";
import DrawSidebar from "./DrawSidebar.tsx";
import styles from "./DrawContent.module.css";

type DrawContentProps = {
    completeDraw: (drawMonthName: string, drawYear: number) => void;
    isTest?: boolean;
}

export default function DrawContent(props: DrawContentProps) {
    const [currentDrawMonthName, setCurrentDrawMonthName] = useState<string | null>('');
    const [currentDraw, setDrawYear] = useState<number | null>(0);
    const dispatch = useAppDispatch();

    async function populateCurrentDraw() {
        const endpointUrl = props.isTest
            ? "/draws/test"
            : "/draws/current";
        const currentDraw = await ApiService.get<CurrentDraw>(endpointUrl);

        if (!currentDraw.isTest && currentDraw.drawInfo) {
            const currentDrawDate = new Date(currentDraw.drawInfo.drawYear, currentDraw.drawInfo.drawMonth - 1, 1);
            setCurrentDrawMonthName(currentDrawDate.toLocaleString('default', { month: 'long' }));
            setDrawYear(currentDrawDate.getFullYear());
        }

        dispatch(populateDrawEntries(currentDraw));
    }

    useEffect(() => {
        populateCurrentDraw();
    }, []);

    return <>
        <div className={styles.container}>
            <Row className={"g-0 h-100"}>
                <Col xs={7}>
                    <DrawControl completeDraw={() => props.completeDraw(currentDrawMonthName!, currentDraw!)} />
                </Col>
                <Col xs={5}>
                    <DrawSidebar drawMonthName={currentDrawMonthName} drawYear={currentDraw} isTest={props.isTest} />
                </Col>
            </Row>
        </div>
    </>
}