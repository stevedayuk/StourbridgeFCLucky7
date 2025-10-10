import styles from './DrawControl.module.css';
import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import {useRef, useState} from "react";
import Button from 'react-bootstrap/Button'
import {setAsWinner} from "../store/current-draw-slice.ts";
import type {DrawEntry} from "../types/DrawEntry.ts";
import type {DrawWinner} from "../types/DrawWinner.ts";
import { ApiService } from '../services/apiService.ts';
import type {SetDrawWinner} from "../types/SetDrawWinner.ts";

type DrawControlProps = {
    completeDraw: () => void;
};

export default function DrawControl(props: DrawControlProps) {
    const currentDraw = useAppSelector(state => state.currentDraw.draw);
    const [currentWinner, setCurrentWinner] = useState<DrawEntry | null>(null);
    const [currentWinningPrizeLevel, setCurrentWinningPrizeLevel] = useState<DrawWinner | null>(null);
    const dispatch = useAppDispatch();

    const entries = currentDraw?.entries.filter(entry => !entry.isWinner);
    const entryCount = entries?.length ?? 0;
    const [number, setNumber] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDrawComplete, setIsDrawComplete] = useState(false);
    const timerRef = useRef<number | null>(null);

    function completeDraw() {
        props.completeDraw();
    }

    function drawNumber() {
        const shuffle = () => {
            const numbers = Array.from({length: entryCount}, (_, i) => i + 1);
            for (let i = numbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }
            return numbers[0];
        };

        setIsDrawing(true);

        if (!currentDraw) {
            return;
        }

        const currentWinningPrizeLevelIndex = currentDraw.drawOrder == 'highest_first'
            ? currentDraw.winners.findIndex(winner => !winner.number)
            : currentDraw.winners.findLastIndex(winner => !winner.number);

        const currentWinningPrizeLevel = currentDraw.winners[currentWinningPrizeLevelIndex];
        setCurrentWinningPrizeLevel(currentWinningPrizeLevel);

        let elapsed = 0;
        const duration = currentDraw!.numberSelectionTime * 1000;
        const interval = 100;

        timerRef.current = window.setInterval(async () => {
            let numberIndex = shuffle();
            numberIndex = numberIndex - 1;
            const potentialWinner = entries![numberIndex];
            setNumber(potentialWinner.number);
            elapsed += interval;

            if (elapsed >= duration && timerRef.current) {
                setNumber(potentialWinner.number);
                setCurrentWinner(potentialWinner);
                dispatch(setAsWinner(
                    {
                        drawEntry: potentialWinner,
                        prizeAmount: currentWinningPrizeLevel.prizeAmount,
                        drawOrder: currentDraw.drawOrder,
                        isTest: currentDraw.isTest
                    }
                ));

                clearInterval(timerRef.current);
                setIsDrawing(false);

                const unnamedWinners = currentDraw.winners.filter(winner => !winner.name);
                if (unnamedWinners.length === 1) {
                    if (!currentDraw.isTest) {
                        const endpointUrl = "/draws/complete";
                        const body = {
                            drawMonth: currentDraw.drawInfo!.drawMonth,
                            drawYear: currentDraw.drawInfo!.drawYear,
                        }

                        await ApiService.put(endpointUrl, body);
                    }

                    setIsDrawComplete(true);
                }

                if (!currentDraw.isTest && currentDraw.drawInfo?.drawId) {
                    const setDrawWinner: SetDrawWinner = {
                        drawId: currentDraw.drawInfo!.drawId!,
                        prizeLevelId: currentWinningPrizeLevel.prizeLevelId,
                        entryId: potentialWinner.entryId,
                    };

                    const endpointUrl = "/draws/set-winner";
                    await ApiService.post(endpointUrl, setDrawWinner)
                }
            }
        }, interval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }

    return <div className={styles.container}>
        <div className={styles.control}>
            <div className={styles.number}>
                {(isDrawing || currentWinner) && number > 0 &&
                    <span className={styles.drawingNumber}>{number}</span>
                }
            </div>
            <div className={styles.footer}>
                <div className={styles.currentWinnerContainer}>
                    {!isDrawing && currentWinner &&
                        <div className={styles.currentWinner}>
                            <div>
                                £{currentWinningPrizeLevel?.prizeAmount}
                            </div>
                            <div className={"fw-bold"}>
                                {currentWinner?.name ?? "Waiting for winner..."}
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.drawButtonContainer}>
                    {(!isDrawing && !isDrawComplete) &&

                        <Button className={"w-100"}
                                variant={"danger"}
                                size={"lg"}
                                onClick={() => drawNumber()}>
                            Draw Number
                        </Button>
                    }
                    {!isDrawing && isDrawComplete &&
                        <Button className={"w-100"}
                                variant={"danger"}
                                size={"lg"}
                                onClick={() => completeDraw()}>
                            Complete Draw
                        </Button>
                    }
                </div>
            </div>
        </div>
    </div>
}