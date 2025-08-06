import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {useAppDispatch} from "../store/hooks.ts";
import {useEffect} from "react";
import {get} from "../util/http.ts";
import type {CurrentDraw} from "../types/CurrentDraw.ts";
import {populateDrawEntries} from "../store/current-draw-slice.ts";
import DrawControl from "./DrawControl.tsx";
import DrawSidebar from "./DrawSidebar.tsx";

type DrawContentProps = {
    isTest?: boolean;
}

export default function DrawContent(props: DrawContentProps) {
    const dispatch = useAppDispatch();

    async function populateCurrentDraw() {
        const apiUrl = props.isTest
            ? import.meta.env.VITE_API_URL + "/draws/test"
            : import.meta.env.VITE_API_URL + "/draws/current";
        const currentDraw = (await get(apiUrl)) as CurrentDraw;

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
    </>
}