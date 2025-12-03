import {Container} from "react-bootstrap";
import AdminMenuCard from "../../../admin/AdminMenuCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AdminTextHeader from "../../../admin/AdminTextHeader.tsx";

export default function UsersPage() {
    return (
        <Container className={"mt-3"}>
            <AdminTextHeader backHref={"/admin"} title={"Users"} />
            <Row>
                <Col xs={12} md={6} lg={4} className={"mb-3"}>
                    <AdminMenuCard title="Import Users" imageUrl="/images/admin-user-management.jpg" linkUrl="/admin/users/import" />
                </Col>
            </Row>
        </Container>
    )
}