import styles from '../pages/Home.module.css';

export default function RecentWinners() {
  return (
    <section id="winners" className={styles.bento} aria-labelledby="winners-heading">
      <h2 id="winners-heading" className={styles.sectionTitle}>Most recent draw winners</h2>
      <div className={`${styles.panel} ${styles.panelGlow}`} role="region" aria-label="Winners table">
        <p className={styles.tagline} aria-live="polite">Placeholders shown until the latest results are published.</p>
        <div className={styles.tableWrap}>
          <table className={styles.winnersTable} aria-describedby="winners-heading">
            <caption className={styles['visually-hidden']}>List of prize winners for the most recent draw</caption>
            <thead>
              <tr>
                <th scope="col">Prize</th>
                <th scope="col">Winner</th>
                <th scope="col">Ticket</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>£250</td>
                <td>To be announced</td>
                <td>—</td>
              </tr>
              <tr>
                <td>£150</td>
                <td>To be announced</td>
                <td>—</td>
              </tr>
              <tr>
                <td>£100</td>
                <td>To be announced</td>
                <td>—</td>
              </tr>
              <tr>
                <td>£50</td>
                <td>To be announced</td>
                <td>—</td>
              </tr>
              <tr>
                <td>£50</td>
                <td>To be announced</td>
                <td>—</td>
              </tr>
              <tr>
                <td>£50</td>
                <td>To be announced</td>
                <td>—</td>
              </tr>
              <tr>
                <td>£50</td>
                <td>To be announced</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
