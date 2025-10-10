import {Container, InputGroup, Spinner} from "react-bootstrap";
import {useState} from "react";
import {getFileNameWithExt} from "../../util/files.ts";
import Button from "react-bootstrap/Button";
import {postForm, put} from "../../util/http.ts";
import type {ParsedDrawEntry} from "../../types/ParsedDrawEntry.ts";
import {ParsedDrawItemsGroup} from "../../admin/ParsedDrawItemsGroup.tsx";
import styles from './ImportUsersPage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll, faUpload } from "@fortawesome/free-solid-svg-icons";

export default function ImportUsersPage() {
    const [updateUsersError, setUpdateUsersError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isParsingUploadFile, setIsParsingUploadFile] = useState(false);
    const [isUpdatingUsers, setIsUpdatingUsers] = useState(false);
    const [parsedDrawEntries, setParsedDrawEntries] = useState<ParsedDrawEntry[]>([]);

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

        const apiUrl = import.meta.env.VITE_API_URL + "/entries/parse-process-from-spreadsheet?drawMonth=9&drawYear=2025";
        const parsedDrawEntries = (await postForm(apiUrl, formData)) as ParsedDrawEntry[];
        setParsedDrawEntries(parsedDrawEntries);
        setIsParsingUploadFile(false);
    }

    async function handleUpdateUsers() {
        setIsUpdatingUsers(true);

        const apiUrl = import.meta.env.VITE_API_URL + "/entries/update-entries";

        try {
            await put(apiUrl, parsedDrawEntries);

        } catch(error) {
            setUpdateUsersError((error as Error).message);
        }

        setIsUpdatingUsers(false);
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

    return (
        <Container className={"mt-3"}>
            <h1>Import Users</h1>
            <div className={"mt-3"}>
                <InputGroup>
                    <input type="file" className="form-control" onChange={handleFileChange} />
                </InputGroup>
                {file && !isParsingUploadFile && !isUpdatingUsers && <div className={"mt-3"}>
                    <Button variant="danger" onClick={handleUpload}>
                        <FontAwesomeIcon className={"me-2"} icon={faScroll} />
                        Upload and Check File</Button>
                </div>}
                {(isParsingUploadFile || isUpdatingUsers) && <div className={"d-flex p-3 justify-content-center align-items-center"}>
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
        </Container>
    )
}
