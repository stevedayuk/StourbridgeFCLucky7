import type {ParsedDrawEntry} from "../types/ParsedDrawEntry.ts";
import type {ParsedEntryState} from "../types/ParsedEntryState.ts";
import {Alert, Badge, Col, Row} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export type ParsedDrawItemsGroupProps = {
    headerText: string,
    isExpandedByDefault?: boolean,
    noRecordsText: string,
    parsedDrawEntryItems: ParsedDrawEntry[],
    state: ParsedEntryState,
}

export function ParsedDrawItemsGroup(props: ParsedDrawItemsGroupProps) {
    const isExpandedByDefaultClassName = props.isExpandedByDefault ? "collapse show" : "collapse";

    return (
        <div className="card">
            <div className="card-header border-1"
                 data-bs-toggle="collapse"
                 data-bs-target={`#${props.state.toLowerCase()}`}
                 aria-expanded={props.isExpandedByDefault ?? false}
                 aria-controls={props.state.toLowerCase()}
                 style={{
                     cursor: "pointer",
                     border: "1px solid var(--bs-card-border-color)",
                     borderRadius: "var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius) 0 0",
                 }}>
                <div className="fw-bold d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-centre gap-2">
                        {props.headerText}
                        <Badge bg={"primary"}>{props.parsedDrawEntryItems.length}</Badge>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <i className="fa-solid fa-chevron-down collapse-icon"></i>
                    </div>
                </div>
            </div>
            <div className={isExpandedByDefaultClassName} id={props.state.toLowerCase()}>
                <div className="card-body">
                    {props.parsedDrawEntryItems.length === 0
                        ? <Alert className={"mb-0"} variant="info">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2"/>
                            {props.noRecordsText}
                        </Alert>
                        : <Row>
                            {props.parsedDrawEntryItems.map(item => (
                                <Col xs={12} sm={6} md={4} lg={3} key={item.number}>
                                    <strong>{item.number}</strong> - {item.name}
                                </Col>
                            ))}
                        </Row>}
                </div>
            </div>
        </div>
    )
}