import DrawHeader from "../../draw/DrawHeader.tsx";

import styles from './DrawPage.module.css';
import DrawContent from "../../draw/DrawContent.tsx";
import StartDraw from "../../draw/StartDraw.tsx";
import {useState} from "react";


export default function DrawPage() {
    const [isDrawing, setIsDrawing] = useState(false);

    function startDraw() {
        setIsDrawing(true);
    }

    return <div className={styles.page}>
        <DrawHeader />
        {!isDrawing && <StartDraw startDraw={startDraw} />}
        {isDrawing && <DrawContent />}
    </div>
}