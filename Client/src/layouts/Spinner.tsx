import BsSpinner from 'react-bootstrap/Spinner';
import styles from './Spinner.module.css';

export default function Spinner() {
    return <div className={styles.spinner}>
        <BsSpinner animation="border" role="status" variant={"danger"}>
            <span className="visually-hidden">Loading...</span>
        </BsSpinner>
    </div>
}