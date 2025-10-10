import {useAppSelector} from "../store/hooks.ts";
// import DrawPromo from "./DrawPromo.tsx";
import Table from 'react-bootstrap/Table';
import styles from './DrawSidebar.module.css';

type DrawSidebarProps = {
    isTest?: boolean;
    drawMonthName: string | null;
    drawYear: number | null;
};

export default function DrawSidebar(props: DrawSidebarProps) {
    const currentDraw = useAppSelector(state => state.currentDraw.draw);

    return <div className={styles.drawSidebar}>
        <div className={styles.drawWinners}>
            <div className={styles.drawWinnersHeader}>
                {props.isTest && <h1>Test Draw Winners</h1>}
                {!props.isTest && <h1>{props.drawMonthName} {props.drawYear} Winners</h1> }
            </div>
            <Table className={styles.winnersTable}>
                <tbody>
                {currentDraw?.winners?.map((winner, index) => (
                    <tr className={"h2"} key={index}>
                        <td className={styles.prizeAmountColumn}>
                            £{winner.prizeAmount}
                        </td>
                        <td className={styles.winningEntryNumberColumn}>
                            {winner.number}
                        </td>
                        <td>{winner.name}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
        <div className={styles.drawPromo}>
            {/*<DrawPromo />*/}
        </div>
    </div>
}