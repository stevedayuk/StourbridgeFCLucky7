import styles from './PromoCard.module.css';

type PromoCardProps = {
    title: string,
    subtitle: string
}

export default function PromoCard(props: PromoCardProps) {
    return <div className={styles.card}>
        <div className={styles.title}>
            {props.title}
        </div>
        <div className={styles.subTitle}>
            {props.subtitle}
        </div>
    </div>
}