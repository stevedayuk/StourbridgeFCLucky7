import PromoCard from "./PromoCard.tsx";
import styles from './PromoCards.module.css';

export default function PromoCards() {
    return <div className={"container2"}>
        <div className={styles.container}>
            <PromoCard title={"£250"} subtitle={"Top prize"} />
            <PromoCard title={"7"} subtitle={"Winners monthly"} />
            <PromoCard title={"100%"} subtitle={"Supports your club"} />
        </div>
    </div>
}