import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import {useEffect, useState} from "react";
import {get} from "../util/http.ts";
import type {CurrentDraw} from "../types/CurrentDraw.ts";
import {populateDrawEntries} from "../store/current-draw-slice.ts";
import DrawControl from "./DrawControl.tsx";
import DrawSidebar from "./DrawSidebar.tsx";

export default function DrawContent() {
    const currentDraw = useAppSelector(state => state.currentDraw.draw);
    const [currentDrawMonthName, setCurrentDrawMonthName] = useState('');
    const dispatch = useAppDispatch();

    async function populateCurrentDraw() {
        const apiUrl = import.meta.env.VITE_API_URL + '/draws/current';
        const currentDraw = (await get(apiUrl)) as CurrentDraw;
        const currentDrawDate = new Date(currentDraw.drawInfo.drawYear, currentDraw.drawInfo.drawMonth, 1);
        setCurrentDrawMonthName(currentDrawDate.toLocaleString('default', { month: 'long' }));

        dispatch(populateDrawEntries(currentDraw));
    }

    useEffect(() => {
        populateCurrentDraw();
    }, []);

    return <>
        <div>
            <Row>
                <Col xs={7}>
                    <DrawControl />
                </Col>
                <Col xs={5}>
                    <DrawSidebar />
                </Col>
            </Row>
        </div>
        {currentDraw?.entries &&
            <div className={"text-black"}>
                <div className={"fw-bold"}>
                    Current Draw: {currentDrawMonthName} {currentDraw.drawInfo.drawYear}
                </div>

                <div>
                    {currentDraw?.entries.map(item => {
                        return <div key={item.number}>
                            <span>{item.number} - {item.name}</span>
                        </div>
                    })}
                </div>
            </div>
        }</>
}