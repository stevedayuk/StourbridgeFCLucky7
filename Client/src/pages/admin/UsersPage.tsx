import {Container} from "react-bootstrap";
import styles from './UsersPage.module.css';
import {NavLink} from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function UsersPage() {
    return (
        <Container className={"mt-3"}>
            <h1>Users</h1>
            <div className={styles.userActions}>
                <NavLink className={"btn btn-primary"} to={"/admin/users/import"}>
                    <FontAwesomeIcon className={"me-2"} icon={faUserPlus} />
                    Import Users
                </NavLink>
            </div>
        </Container>
    )
}