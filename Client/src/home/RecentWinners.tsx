import {get} from "../util/http.ts";
import {useEffect, useState} from "react";
import type {PublicWinners} from "../types/PublicWinners.ts";
import type {PublicDraw} from "../types/PublicDraw.ts";
import {getMonthNameByNumber} from "../util/date.ts";
import type {PublicWinner} from "../types/PublicWinner.ts";
import styles from './RecentWinners.module.css';
import homeStyles from '../pages/HomePage.module.css';

export default function RecentWinners() {
    const [draws, setDraws] = useState<PublicDraw[]>([]);
    const [drawYears, setDrawYears] = useState<number[]>([]);
    const [drawMonths, setDrawMonths] = useState<number[]>([]);

    const [selectedDrawYear, setSelectedDrawYear] = useState<number | undefined>();
    const [selectedDrawMonth, setSelectedDrawMonth] = useState<number | undefined>();
    const [selectedDrawWinners, setSelectedDrawWinners] = useState<PublicWinner[]>([]);

    async function getInitialDrawWinners() {
        const apiUrl = import.meta.env.VITE_API_URL + "/winners";
        const initialDrawWinners = (await get(apiUrl)) as PublicWinners;

        // Update draws first
        const incomingDraws = initialDrawWinners.draws ?? [];
        setDraws(incomingDraws);

        // Compute and set unique years
        const years = Array.from(new Set(incomingDraws.map(d => d.year))).sort((a, b) => a - b);
        setDrawYears(years);

        // Select the most recent year; months will be derived in useEffect
        const mostRecentYear = years.length ? years[years.length - 1] : undefined;
        setSelectedDrawYear(mostRecentYear);
    }

    async function handleSelectedYearChange(year: number) {
        setSelectedDrawYear(year);

        const drawYearMonths = draws.filter(d => d.year === year).map(d => d.month);
        setDrawMonths(drawYearMonths);
        setSelectedDrawMonth(drawYearMonths.length ? drawYearMonths[drawYearMonths.length - 1] : undefined);
    }

    // Derive months whenever draws or selected year change
    useEffect(() => {
        if (selectedDrawYear == null) {
            setDrawMonths([]);
            setSelectedDrawMonth(undefined);
            return;
        }

        let mostRecentMonth = selectedDrawMonth;

        if (selectedDrawMonth == null) {
            const months = Array.from(
                new Set(draws.filter(d => d.year === selectedDrawYear).map(d => d.month))
            ).sort((a, b) => a - b);

            setDrawMonths(months);

            // Auto-select most recent month for the selected year
            mostRecentMonth = months.length ? months[months.length - 1] : undefined;
            setSelectedDrawMonth(mostRecentMonth);
        }

        const apiUrl = import.meta.env.VITE_API_URL + `/winners/draw?year=${selectedDrawYear}&month=${mostRecentMonth}`;
        get(apiUrl)
            .then(d => {
                return d as PublicWinner[];
            })
            .then(d => setSelectedDrawWinners(d));

    }, [draws, selectedDrawYear, selectedDrawMonth]);

    useEffect(() => {
        void getInitialDrawWinners();
    }, []);

    return (
        <section id="winners" className={homeStyles.bento} aria-labelledby="winners-heading">
            <h2 id="winners-heading" className={homeStyles.sectionTitle}>Most recent draw winners</h2>
            <div className={`${homeStyles.panel} ${homeStyles.panelGlow}`} role="region" aria-label="Winners table">
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <div>
                        Winners by draw:
                    </div>

                    <select
                        value={selectedDrawMonth ?? ""}
                        onChange={(e) => setSelectedDrawMonth(Number(e.target.value))}
                        disabled={!drawMonths.length}
                    >
                        {drawMonths.map((month) => (
                            <option key={month} value={month}>{getMonthNameByNumber(month)}</option>
                        ))}
                    </select>

                    <select
                        value={selectedDrawYear ?? ""}
                        onChange={(e) => handleSelectedYearChange(Number(e.target.value))}
                    >
                        {drawYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className={homeStyles.tableWrap}>
                    <table className={homeStyles.winnersTable} aria-describedby="winners-heading">
                        <caption className={homeStyles['visually-hidden']}>
                            List of prize winners for the most recent draw
                        </caption>
                        <thead>
                        <tr>
                            <th scope="col">Prize</th>
                            <th scope="col">Number</th>
                            <th scope="col">Winner</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedDrawWinners.length === 0 && <tr>
                            <td colSpan={3}>No winners for this draw</td>
                        </tr>}
                        {selectedDrawWinners.length > 0 &&
                            selectedDrawWinners.map((winner) => (
                                <tr key={winner.number}>
                                    <td className={styles.tableFixedWidth}>£{winner.prizeAmount}</td>
                                    <td className={styles.tableFixedWidth}>{winner.number}</td>
                                    <td>{winner.name}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
