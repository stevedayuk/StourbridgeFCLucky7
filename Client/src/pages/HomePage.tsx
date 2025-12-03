import RegistrationForm from '../home/RegistrationForm.tsx';
import styles from './HomePage.module.css';
import RecentWinners from '../winners/RecentWinners.tsx';

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.headerBar}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>
                <img src="/images/logo-bg.webp" alt="Stourbridge FC" />
            </span>
            <span className={styles.brandText}>Stourbridge FC</span>
          </div>
          <nav className={styles.nav} aria-label="Primary">
            <a href="#benefits">Benefits</a>
            <a href="#winners">Winners</a>
            <a href="#register">Register</a>
          </nav>
          <a href="#register" className={styles.ctaSm}>Join Lucky 7</a>
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Official Club Draw</span>
          <h1 className={styles.heroTitle}>Lucky 7 — Win Big, Support Your Club</h1>
          <p className={styles.heroTag}>7 prizes every month with a top prize of £250. Your entry directly supports Stourbridge FC.</p>
          <div className={styles.heroActions}>
            <a href="#register" className={styles.ctaPrimary}>Register</a>
            <a href="#benefits" className={styles.ctaGhost}>See how it works</a>
          </div>
        </div>
      </section>

      <div className={styles.statsStrip} aria-label="Lucky 7 highlights">
        <div className={styles.statCard}><span className={styles.statMain}>£250</span><span className={styles.statSub}>Top prize</span></div>
        <div className={styles.statCard}><span className={styles.statMain}>7</span><span className={styles.statSub}>Winners monthly</span></div>
        <div className={styles.statCard}><span className={styles.statMain}>100%</span><span className={styles.statSub}>Supports the club</span></div>
      </div>


      <section id="benefits" className={styles.bento} aria-labelledby="benefits-heading">
        <h2 id="benefits-heading" className={styles.sectionTitle}>Why join Lucky 7?</h2>
        <div className={styles.bentoGrid}>
          <article className={`${styles.bentoCard} ${styles.cardGlow}`}>
            <div className={styles.cardIcon}>💷</div>
            <h3>Top prize £250</h3>
            <p>Our headline prize each month — plus six more chances to win.</p>
          </article>
          <article className={`${styles.bentoCard} ${styles.cardGlow}`}>
            <div className={styles.cardIcon}>7️⃣</div>
            <h3>Seven winners monthly</h3>
            <p>Prizes range from £50 up to a top prize of £250!</p>
          </article>
          <article className={`${styles.bentoCard} ${styles.cardGlow}`}>
            <div className={styles.cardIcon}>❤️</div>
            <h3>Support the club</h3>
            <p>Every entry helps fund facilities, youth development, and matchday experience.</p>
          </article>
          <article className={`${styles.bentoCard} ${styles.cardGlow}`}>
            <div className={styles.cardIcon}>⚡</div>
            <h3>Fast & easy</h3>
            <p>Register in under a minute with our simple form.</p>
          </article>
          <article className={`${styles.bentoCard} ${styles.cardGlow}`}>
            <div className={styles.cardIcon}>📅</div>
            <h3>Monthly draws</h3>
            <p>Get a chance to win every month, including outside of the football season.</p>
          </article>
          <article className={`${styles.bentoCard} ${styles.cardGlow}`}>
            <div className={styles.cardIcon}>🔐</div>
            <h3>Transparent & fair</h3>
            <p>
                Watch the draw take place in the Glassboys bar each month
                and see the results on our <a href={"https://stourbridgefc.com/"} target={"_blank"}>website</a>, <a href={"https://apps.apple.com/us/app/stourbridge-fc/id6747973463"}>app</a> or <a href={"https://x.com/stourbridgefc"} target={"_blank"}>social media accounts</a>.</p>
          </article>
        </div>
      </section>

      <RecentWinners />

      <section id="register" className={styles.home} aria-labelledby="register-heading">
        <div className={styles.right}>
          <header>
            <h2 id="register-heading" className={styles.title}>Register your details</h2>
            <p className={styles.tagline}>Be added to the next Stourbridge FC Lucky 7 draw.</p>
          </header>

          <div className={`${styles.panel} ${styles.panelGlow}`}>
            <ul className={styles.benefits}>
              <li>Top prize of £250 every month</li>
              <li>6 additional cash prizes</li>
              <li>Your participation directly supports Stourbridge FC</li>
            </ul>
            <div className={styles.formBlock}>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}