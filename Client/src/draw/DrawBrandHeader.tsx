import styles from './DrawBrandHeader.module.css'
import headerLogo from '../assets/images/header_logo_150.png';

export default function DrawBrandHeader() {
    return (
        <div className={styles.drawBrandHeader}>
            <div>
                <img src={headerLogo} alt={"Stourbridge FC Lucky 7"} />
            </div>
            <div>
                <h1>Stourbridge FC Lucky 7</h1>
            </div>
        </div>
    );
}