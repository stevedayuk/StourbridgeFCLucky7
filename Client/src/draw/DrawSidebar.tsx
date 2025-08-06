import {useAppSelector} from "../store/hooks.ts";
import DrawPromo from "./DrawPromo.tsx";
import Table from 'react-bootstrap/Table';
import styles from './DrawSidebar.module.css';

export default function DrawSidebar() {
    const currentDraw = useAppSelector(state => state.currentDraw.draw);

    return <div className={styles.drawSidebar}>
        <div className={styles.drawWinners}>
            <div className={"my-3"}>
                <h1>THIS MONTH'S WINNERS</h1>
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
            <DrawPromo />
        </div>
    </div>
}