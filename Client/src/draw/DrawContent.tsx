import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {useAppDispatch} from "../store/hooks.ts";
import {useEffect, useState} from "react";
import {get} from "../util/http.ts";
import type {CurrentDraw} from "../types/CurrentDraw.ts";
import {populateDrawEntries} from "../store/current-draw-slice.ts";
import DrawControl from "./DrawControl.tsx";
import DrawSidebar from "./DrawSidebar.tsx";

type DrawContentProps = {
    completeDraw: (drawMonthName: string, drawYear: number) => void;
    isTest?: boolean;
}

export default function DrawContent(props: DrawContentProps) {
    const [currentDrawMonthName, setCurrentDrawMonthName] = useState<string | null>('');
    const [currentDraw, setDrawYear] = useState<number | null>(0);
    const dispatch = useAppDispatch();

    async function populateCurrentDraw() {
        const apiUrl = props.isTest
            ? import.meta.env.VITE_API_URL + "/draws/test"
            : import.meta.env.VITE_API_URL + "/draws/current";
        const currentDraw = (await get(apiUrl)) as CurrentDraw;

        if (!currentDraw.isTest) {
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
        <div>
            <Row>
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