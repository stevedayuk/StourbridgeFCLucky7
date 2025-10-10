import styles from './AdminMenuCard.module.css';
import {NavLink} from "react-router";

export type AdminMenuCardProps = {
    title: string,
    subtitle?: string | null,
    imageUrl: string,
    linkUrl: string
}

export default function AdminMenuCard(props: AdminMenuCardProps) {
    return <div className={styles.adminMenuCard}>
        <NavLink to={props.linkUrl}>
            <div className={styles.adminMenuCardHeader}>
                {props.title}
            </div>
            <div className={styles.adminMenuCardImage} style={{backgroundImage: `url(${props.imageUrl})`}}>

            </div>
        </NavLink>
    </div>
}