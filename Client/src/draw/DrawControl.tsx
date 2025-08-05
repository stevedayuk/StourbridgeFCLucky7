import styles from './DrawControl.module.css';

export default function DrawControl() {
    return <div className={styles.container}>
        <div className={styles.control}>
            <div className={styles.number}>
                <span className={styles.drawingNumber}>400</span>
            </div>
            <div className={styles.footer}>
                <div>
                    £250
                </div>
                <div className={"fw-bold"}>
                    Dan Smith
                </div>
            </div>
        </div>
    </div>
}