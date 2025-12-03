import {Container, InputGroup, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getFileNameWithExt} from "../../../util/files";
import Button from "react-bootstrap/Button";
import { ApiService } from "../../../services/apiService";
import type {ParsedDrawEntry} from "../../../types/ParsedDrawEntry";
import {ParsedDrawItemsGroup} from "../../../admin/ParsedDrawItemsGroup";
import styles from './ImportUsersPage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faScroll, faUpload } from "@fortawesome/free-solid-svg-icons";
import type {CurrentDrawInfo} from "../../../types/CurrentDrawInfo";
import AdminTextHeader from "../../../admin/AdminTextHeader.tsx";
import Alert from "react-bootstrap/Alert";
import {Link} from "react-router";
import type {ActionResult} from "../../../types/ActionResult.ts";

export default function ImportUsersPage() {
    const [drawInfo, setDrawInfo] = useState<CurrentDrawInfo | null>(null);
    const [updateUsersError, setUpdateUsersError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isParsingUploadFile, setIsParsingUploadFile] = useState(false);
    const [isUpdatingUsers, setIsUpdatingUsers] = useState(false);
    const [parsedDrawEntries, setParsedDrawEntries] = useState<ParsedDrawEntry[]>([]);
    const [isImportComplete, setIsImportComplete] = useState(false);

    async function populateCurrentDrawInfo() {
        const endpointUrl = "/draws/current-info";
        const currentDrawInfo = await ApiService.get<CurrentDrawInfo>(endpointUrl);
        setDrawInfo(currentDrawInfo);
    }

    useEffect(() => {
        populateCurrentDrawInfo();
    }, []);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const file = getFileNameWithExt(event.target.files[0].name);

            if (file.extension !== 'xlsx') {
                setFile(null);
                console.log("Invalid file type");
                return;
            }

            setFile(event.target.files[0]);
        }
    }

    async function handleUpload() {
        setIsParsingUploadFile(true);

        const formData = new FormData();
        formData.append('file', file!);

        if (drawInfo == null) {
            throw new Error("Draw info not set");
        }

        const endpointUrl = `/entries/parse-process-from-spreadsheet?drawMonth=${drawInfo.drawMonth}&drawYear=${drawInfo.drawYear}`;
        const parsedDrawEntries = await ApiService.postFormData<ParsedDrawEntry[]>(endpointUrl, formData);
        setParsedDrawEntries(parsedDrawEntries);
        setIsParsingUploadFile(false);
    }

    async function handleUpdateUsers() {
        if (drawInfo == null) {
            throw new Error("Draw info not set");
        }

        setIsUpdatingUsers(true);

        const endpointUrl = `/entries/update-entries?drawMonth=${drawInfo.drawMonth}&drawYear=${drawInfo.drawYear}`;

        try {
            const result = await ApiService.put<ActionResult>(endpointUrl, parsedDrawEntries);

            if (!result.success) {
                setUpdateUsersError("API returned an unsuccessful message.");
                return;
            }

        } catch(error) {
            setUpdateUsersError((error as Error).message);
        }

        setIsUpdatingUsers(false);
        setIsImportComplete(true);
    }

    if (updateUsersError) {
        return (
            <Container className={"mt-3"}>
                <div>
                    <h1>Import Users</h1>
                    <div className={"mt-3"}>
                        <h2>Error Updating Users</h2>
                        <div>The following error occurred when trying to import users:</div>
                        <div>{updateUsersError}</div>
                    </div>
                </div>
            </Container>
        )
    }

    if (!drawInfo) {
        return <div className={styles.spinnerContainer}>
            <Spinner variant={"danger"} />
        </div>;
    }

    if (isImportComplete) {
        return (
            <Container className={"mt-3"}>
                <div>
                    <AdminTextHeader backHref={"/admin/users"} title={"Import Users"} />
                    <Alert variant={"success"}>
                        <div className={"d-flex align-items-center gap-2 mb-3"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Users have been successfully updated.</div>
                        <Link to={"/admin"}>
                            <Button variant={"danger"}>Return to Admin home page</Button>
                        </Link>
                    </Alert>
                </div>
            </Container>
        )
    }

    return (
        <Container className={"mt-3"}>
            <AdminTextHeader backHref={"/admin/users"} title={"Import Users"} />
            <div>
                <div>
                    <Alert>
                        <p>Want to update the entries in the Lucky 7 app database to match the details in the latest Lucky 7 spreadsheet? You're in the right place!</p>
                        <div>Click/Tap the 'Browse...' button below and select the file to be uploaded.</div>
                    </Alert>
                    <InputGroup>
                        <input type="file" className="form-control" onChange={handleFileChange} />
                    </InputGroup>
                    {file && !isParsingUploadFile && !isUpdatingUsers && <div className={"mt-3"}>
                        <Button variant="danger" onClick={handleUpload}>
                            <FontAwesomeIcon className={"me-2"} icon={faScroll} />
                            Upload and Check File</Button>
                    </div>}
                    {(isParsingUploadFile || isUpdatingUsers) && <div className={styles.spinnerContainer}>
                        <Spinner variant={"danger"} />
                    </div>}
                </div>
                {parsedDrawEntries.length > 0 && !isUpdatingUsers && <div className={"mt-3"}>
                    <h2>Imported Results</h2>
                    <div>The following results have been determined from the uploaded spreadsheet.</div>
                    <div>Please check these results are as expected before updating the current users.</div>
                    <div className={styles.importedResultsContainer}>
                        <ParsedDrawItemsGroup headerText={"Added"}
                                              isExpandedByDefault={parsedDrawEntries.filter(e => e.state == "Added").length > 0}
                                              noRecordsText={"No new entries have been added."}
                                              parsedDrawEntryItems={parsedDrawEntries.filter(e => e.state == "Added")}
                                              state={"Added"} />
                        <ParsedDrawItemsGroup headerText={"Updated"}
                                              isExpandedByDefault={parsedDrawEntries.filter(e => e.state == "Updated").length > 0}
                                              noRecordsText={"No entries have been updated."}
                                              parsedDrawEntryItems={parsedDrawEntries.filter(e => e.state == "Updated")}
                                              state={"Updated"} />
                        <ParsedDrawItemsGroup headerText={"Deleted"}
                                              isExpandedByDefault={parsedDrawEntries.filter(e => e.state == "Deleted").length > 0}
                                              noRecordsText={"No entries have been deleted."}
                                              parsedDrawEntryItems={parsedDrawEntries.filter(e => e.state == "Deleted")}
                                              state={"Deleted"} />
                        <ParsedDrawItemsGroup headerText={"Unchanged"}
                                              noRecordsText={"No entries are unchanged."}
                                              parsedDrawEntryItems={parsedDrawEntries.filter(e => e.state == "Unchanged")}
                                              state={"Unchanged"} />
                    </div>
                    <div className={"mt-3"}>
                        <h2>Ready To Update?</h2>
                        <div>Everything look good with the results from the uploaded spreadsheet?</div>
                        <div className={"py-3"}>
                            <Button variant="danger" onClick={handleUpdateUsers}>
                                <FontAwesomeIcon className={"me-2"} icon={faUpload} />
                                Update Users
                            </Button>
                        </div>
                    </div>
                </div>}
            </div>
        </Container>
    )
}
