import {Navigate, Outlet} from "react-router";
import {useAuth} from "../hooks/useAuth.ts";
import {Spinner} from "react-bootstrap";

export default function PrivateRoutes() {
    const { user, loading} = useAuth();

    const currentRoute = window.location.pathname;

    if (loading) {
        return <div className={"d-flex p-3 justify-content-center align-items-center"}>
            <Spinner variant={"danger"} />
        </div>
    }

    return (
        user ? <Outlet/> : <Navigate to={`/admin/login?redirectUrl=${currentRoute}`}/>
    )
}