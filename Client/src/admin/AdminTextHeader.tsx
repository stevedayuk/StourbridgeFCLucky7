import styles from './AdminTextHeader.module.css';
import {Link} from "react-router";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";

type AdminTextHeaderProps = {
    backHref?: string | null,
    title: string
}

export default function AdminTextHeader(props: AdminTextHeaderProps) {
    return (
        <div className={styles.header}>
            {props.backHref && <Link to={props.backHref}>
                <Button>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Back
                </Button>
            </Link>}

            <h1 className={styles.text}>{props.title}</h1>
        </div>
    );
}