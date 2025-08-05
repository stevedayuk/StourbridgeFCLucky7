import headerLogo from '../assets/images/header_logo.png'
import styles from './DrawHeader.module.css';


export default function DrawHeader() {
    return (
        <header className={styles.drawHeader}>
            <img className={styles.drawHeaderLogo} src={headerLogo} alt="logo" />
            <div>
                <h1>STOURBRIDGE FC - LUCKY 7</h1>
            </div>
        </header>
    );
}