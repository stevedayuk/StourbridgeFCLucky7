import headerLogo from '../assets/images/header_logo.png'
import styles from './AdminHeader.module.css';
import type {AdminHeaderMode} from "../types/AdminHeaderMode.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserCheck, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {signOut} from "firebase/auth";
import {auth} from "../firebase.ts";

type AdminHeaderProps = {
    mode: AdminHeaderMode
};

export default function AdminHeader(props: AdminHeaderProps) {
    const { user, } = useAuth();

    const [userMenuVisible, setUserMenuVisible] = useState(false);

    async function logout() {
        await signOut(auth);
        window.location.href = "/";
    }

    function toggleUserMenuVisibility() {
        setUserMenuVisible(!userMenuVisible);
    }

    return (
        <>
            <header className={styles.drawHeader}>
                <div className={styles.drawHeaderTitle}>
                    <img className={styles.drawHeaderLogo} src={headerLogo} alt="logo"/>
                    <div>
                        <h1>STOURBRIDGE FC - LUCKY 7</h1>
                    </div>
                </div>
                {props.mode === "admin" && user && <div className={styles.drawHeaderUser}>
                    <FontAwesomeIcon icon={faUser} size={"2xl"} onClick={toggleUserMenuVisibility}/>
                </div>}
            </header>
            {userMenuVisible && user && <div className={styles.userMenu}>
                <div className={styles.userMenuHeader}>
                    <div>
                        <FontAwesomeIcon icon={faUserCheck} size={"2xl"} />
                    </div>
                    <div>
                        <div>
                            <strong>{user.displayName ?? user.email}</strong>
                        </div>
                        {user.displayName && <div>
                            {user.email}
                        </div> }
                    </div>
                </div>
                <ul>
                    <li>
                        <a onClick={logout}>
                            <FontAwesomeIcon icon={faUserMinus} />
                            Logout
                        </a>
                    </li>
                </ul>

            </div>}
        </>
    );
}