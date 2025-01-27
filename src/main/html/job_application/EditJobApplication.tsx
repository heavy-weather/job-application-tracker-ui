import * as React from 'react';
import {ChangeEvent, MouseEvent, useContext, useState} from 'react';
import {useOutletContext} from "react-router-dom";
import {StatusesContext} from "../context/StatusesContext";
import dateUtil from "../util/DateUtil";
import JobApplication from "../types/JobApplication";
import {Spinner} from "react-bootstrap";
import {apiUrl} from "../ApiUrl";
import {transmissionUtil} from "../util/TransmissionUtil";
import RenderedPdfModal from "./RenderedPdfModal";

export default function EditJobApplication() {
    const {jobApplication, revalidateJobApplications} = useOutletContext() as {jobApplication: JobApplication, revalidateJobApplications: () => void};
    const statuses = useContext(StatusesContext) as string[];
    const [workingJobApplication, setWorkingJobApplication] = useState(JSON.parse(JSON.stringify(jobApplication)));
    const [workingSentDate, setWorkingSentDate] = useState(
        dateUtil.convertUTCISOZonedDateTimeToInputLocalDate(jobApplication.sentDate)
    );
    const [workingResumeFile, setWorkingResumeFile] = useState(undefined as File | undefined);
    const [lastSavedResumePdf, setLastSavedResumePdf] = useState(undefined as Blob | undefined);
    const [showRenderedPdf, setShowRenderedPdf] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const convertPdf = () => {
        setIsLoading(true);
        transmissionUtil.base64DecodeAndGunzipString(jobApplication.resume.pdfFile, 'application/pdf')
            .then((blob: Blob) => {
                setLastSavedResumePdf(blob);
                setIsLoading(false);
            });
    }

    if (jobApplication.id !== workingJobApplication.id) {
        const newWorkingJobApplication = JSON.parse(JSON.stringify(jobApplication));
        setWorkingJobApplication(newWorkingJobApplication);
        const newSentDate = dateUtil.convertUTCISOZonedDateTimeToInputLocalDate(newWorkingJobApplication.sentDate)
        setWorkingSentDate(newSentDate);
        convertPdf();
    }

    if (!lastSavedResumePdf && !isLoading) {
        convertPdf();
    }

    const updateStringValue = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: 'jobTitle' | 'jobDescription' | 'status' | 'jobPostingUrl' | 'sentDate' | 'notes'
    ): void => {
        const newWorkingJobApplication: JobApplication = JSON.parse(JSON.stringify(workingJobApplication)) as JobApplication;
        newWorkingJobApplication[field] = e.currentTarget.value;
        setWorkingJobApplication(newWorkingJobApplication);
    }

    const updateDate = (e: ChangeEvent<HTMLInputElement>) => {
        const newWorkingJobApplication: JobApplication = JSON.parse(JSON.stringify(workingJobApplication)) as JobApplication;
        newWorkingJobApplication.sentDate = dateUtil.convertInputLocalDateToUTCISOZonedDateTime(e.currentTarget.value);
        setWorkingSentDate(e.currentTarget.value);
        setWorkingJobApplication(newWorkingJobApplication)
    }

    const updateResumeFile = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.currentTarget.files.length === 1) {
            setWorkingResumeFile(e.currentTarget.files[0]);
        } else {
            setWorkingResumeFile(undefined);
        }
    }

    const showRenderedPdfModal = (event: MouseEvent): void => {
        event.preventDefault();
        setShowRenderedPdf(true);
    }

    const closeRenderedPdfModal = (): void => {
        setShowRenderedPdf(false);
    }

    const saveJobApplication = async (e: MouseEvent) => {
        e.preventDefault();
        const updatedJobApplication = JSON.parse(JSON.stringify(workingJobApplication)) as JobApplication;
        updatedJobApplication.companyId = updatedJobApplication.company.id;
        delete updatedJobApplication.company;
        delete updatedJobApplication.resume.pdfFile;

        if (workingResumeFile) {
            delete updatedJobApplication.resume.pdfHash
            updatedJobApplication.resume.docxFile = await transmissionUtil.gzipAndBase64EncodeBlob(workingResumeFile);
        }

        fetch(`${apiUrl}/job-applications/${workingJobApplication.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedJobApplication),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                // TODO: show success toast
                revalidateJobApplications();
                alert('success');
            })
            .catch((err) => {
                // TODO: show error toast
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <>
            <form className="d-flex flex-column">
                <div className="row mb-3 w-100">
                    <div className="col-4">
                        <div className="form-floating input-group">
                            <select
                                className="form-select"
                                name="company"
                                disabled={true}
                                value={workingJobApplication.company.id}
                            >
                                <option value={workingJobApplication.company.id}>
                                    {workingJobApplication.company.name}
                                </option>
                            </select>
                            <label htmlFor="company">Company</label>
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="form-floating">
                            <input
                                className="form-control"
                                name="job-title"
                                type="text"
                                disabled={isLoading}
                                value={workingJobApplication.jobTitle}
                                onChange={(e) => updateStringValue(e, 'jobTitle')}
                            />
                            <label htmlFor="job-title">Job Title</label>
                        </div>
                    </div>

                    <div className="col-4 pe-0">
                        <div className="form-floating">
                            <input
                                className="form-control"
                                name="job-posting-url"
                                type="text"
                                disabled={isLoading}
                                value={workingJobApplication.jobPostingUrl}
                                onChange={(e) => updateStringValue(e, 'jobPostingUrl')}
                            />
                            <label htmlFor="job-posting-url">Job Posting URL</label>
                        </div>
                    </div>
                </div>

                <div className="form-floating mb-3 me-3">
                                <textarea
                                    className="form-control"
                                    name="job-description"
                                    style={{height: '200px'}}
                                    disabled={isLoading}
                                    value={workingJobApplication.jobDescription}
                                    onChange={(e) => updateStringValue(e, 'jobDescription')}
                                />
                    <label htmlFor="job-description">Job Description</label>
                </div>

                <div className="row mb-3 w-100">
                    <div className="col-3">
                        <button
                            className="btn btn-primary"
                            onClick={showRenderedPdfModal}
                            disabled={!lastSavedResumePdf}
                        >
                            Render last saved resume {!lastSavedResumePdf ?
                            <Spinner animation="border" as="span" size="sm" role="status"/> : ''}
                        </button>
                    </div>
                    <div className="col-3">
                        <label htmlFor="resume-file" className="form-label" title="Resume (Only .docx supported)">
                            Resume
                        </label>
                        <input
                            id="resume-file"
                            className="form-control"
                            type="file"
                            accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            multiple={false}
                            onChange={updateResumeFile}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="col-3">
                        <div className="form-floating">
                            <select
                                className="form-select"
                                disabled={isLoading}
                                value={workingJobApplication.status}
                                onChange={(e) => updateStringValue(e, 'status')}
                            >
                                {
                                    statuses.map(status => <option key={status} value={status}>{status}</option>)
                                }
                            </select>
                            <label htmlFor="status">Application Status</label>
                        </div>
                    </div>

                    <div className="col-3 pe-0">
                        <div className="form-floating">
                            <input
                                className="form-control"
                                name="sent-date"
                                type="date"
                                disabled={isLoading}
                                value={workingSentDate}
                                onChange={updateDate}
                            />
                            <label htmlFor="sent-date">Sent Date</label>
                        </div>
                    </div>
                </div>

                <div className="form-floating mb-3">
                        <textarea
                            className="form-control"
                            name="notes"
                            style={{height: '200px'}}
                            disabled={isLoading}
                            value={workingJobApplication.notes || ''}
                            onChange={(e) => updateStringValue(e, 'notes')}
                        />
                    <label htmlFor="notes">Notes</label>
                </div>

                <button
                    onClick={saveJobApplication}
                    className="btn btn-primary align-self-center w-25"
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner animation="border" as="span" size="sm" role="status"/> : 'Save'}
                </button>
            </form>
            {
                lastSavedResumePdf
                    ? <RenderedPdfModal
                        pdfFile={lastSavedResumePdf}
                        show={showRenderedPdf}
                        handleClose={closeRenderedPdfModal}
                    /> : ''
            }
        </>
    )
}
