import {useAppSelector} from "../store/hooks.ts";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import styles from './DrawResults.module.css';
// import DrawPromo from "./DrawPromo.tsx";

type DrawResultsProps = {
    drawMonthName: string | null;
    drawYear: number | null;
};

export default function DrawResults(props: DrawResultsProps) {
    const currentDraw = useAppSelector(state => state.currentDraw.draw);

    return <div className={styles.drawResults}>
        <div className={styles.drawResultsContainer}>
            <div className={styles.drawResultsHeader}>
                {props.drawMonthName && props.drawYear && <h1>{props.drawMonthName} {props.drawYear} Draw Winners</h1>}
                {(!props.drawMonthName || !props.drawYear) && <h1>Test Draw Winners</h1>}
            </div>
            <div className={styles.drawResultsContent}>
                <Table className={styles.winnersTable}>
                    <tbody>
                    {currentDraw?.winners.map((winner, index) => (
                        <tr key={index}>
                            <td className={styles.prizeAmountColumn}>
                                <strong>£{winner.prizeAmount}</strong>
                            </td>
                            <td className={styles.winningEntryNumberColumn}>{winner.number}</td>
                            <td>{winner.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
        <Row>
            <Col xs={7}></Col>
            <Col xs={5}>
                {/*<DrawPromo />*/}
            </Col>
        </Row>
    </div>
}