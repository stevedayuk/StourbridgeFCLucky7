import {Outlet} from "react-router";
import styles from './AdminLayout.module.css';
import AdminHeader from "../admin/AdminHeader.tsx";

export default function AdminLayout() {
    return <div className={styles.adminContainer}>
        <AdminHeader mode={"admin"} />
        <Outlet />
    </div>
}