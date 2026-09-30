import {useAppSelector} from "../store/hooks.ts";
// import DrawPromo from "./DrawPromo.tsx";
import Table from 'react-bootstrap/Table';
import styles from './DrawSidebar.module.css';
import DrawBrandHeader from "./DrawBrandHeader.tsx";

type DrawSidebarProps = {
    isTest?: boolean;
    drawMonthName: string | null;
    drawYear: number | null;
};

export default function DrawSidebar(props: DrawSidebarProps) {
    const currentDraw = useAppSelector(state => state.currentDraw.draw);

    return <div className={styles.drawSidebar}>
        <DrawBrandHeader />

        <div className={styles.drawWinners}>
            <div className={styles.drawWinnersHeader}>
                {props.isTest && <h2 className={"h1"}>Test Draw Winners</h2>}
                {!props.isTest && <h2 className={"h1"}>{props.drawMonthName} {props.drawYear} Winners</h2> }
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