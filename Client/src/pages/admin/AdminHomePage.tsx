import {Container} from "react-bootstrap";
import AdminMenuCard from "../../admin/AdminMenuCard.tsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AdminTextHeader from "../../admin/AdminTextHeader.tsx";

export default function AdminHomePage() {
    return (
        <Container className={"mt-3"}>
            <AdminTextHeader title={"Admin Home Page"} />
            <Row>
                <Col xs={12} md={6} lg={4} className={"mb-3"}>
                    <AdminMenuCard title="New Draw" imageUrl="/images/admin-new-draw.jpg" linkUrl="/draw" />
                </Col>
                <Col xs={12} md={6} lg={4} className={"mb-3"}>
                    <AdminMenuCard title="Test Draw" imageUrl="/images/admin-test-draw.jpg" linkUrl="/draw/test" />
                </Col>
                <Col xs={12} md={6} lg={4} className={"mb-3"}>
                    <AdminMenuCard title="Manage Users" imageUrl="/images/admin-user-management.jpg" linkUrl="/admin/users" />
                </Col>
            </Row>
        </Container>
    )
}