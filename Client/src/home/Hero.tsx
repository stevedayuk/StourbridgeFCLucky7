import styles from './Hero.module.css';

export default function Hero() {
    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <div className={styles.header}>
                </div>
                <div className={styles.bannerContainer}>
                    <div className={styles.banner}>
                        <div className={styles.bannerHeader}>
                            <img src="/images/logo-bg.webp" alt="Stourbridge FC" />
                            <div className={styles.bannerText}>
                                <div>Stourbridge FC</div>
                                <div>Lucky 7</div>
                            </div>
                        </div>
                        <div className={styles.bannerPromo}>
                            Win big - support your club!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}