import qrCode from '../assets/images/applicationform-qrcode.jpg';
import styles from './DrawPromo.module.css';

export default function DrawPromo() {
    return <div className={styles.qrCode}>
            <div>
                <img alt={"Lucky 7 QR Code"} src={qrCode} />
            </div>
        <div>
            <h1>Want to support your club and be in with a chance of winning a prize next month?</h1>
            <h2>Scan the QR code with your mobile device to enter!</h2>
        </div>
            </div>
}