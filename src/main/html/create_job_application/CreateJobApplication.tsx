import * as React from 'react';
import {ChangeEvent, MouseEvent, useContext, useState} from 'react';
import {useOutletContext} from "react-router-dom";
import {StatusesContext} from "../context/StatusesContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Company from "../types/Company";
import CreateCompanyModal from "./CreateCompanyModal";
import {Spinner} from "react-bootstrap";
import {apiUrl} from "../ApiUrl";
import dateUtil from "../util/DateUtil";
import JobApplicationCreatePayload from "../types/JobApplicationCreatePayload";
import ResumeCreatePayload from "../types/ResumeCreatePayload";
import {transmissionUtil} from "../util/TransmissionUtil";

const defaultJobApplication: JobApplicationCreatePayload = {
    jobTitle: '',
    jobDescription: '',
    resume: {
        docxFile: '',
    } as ResumeCreatePayload,
    status: 'ACTIVE',
    jobPostingUrl: '',
    companyId: '',
    sentDate: dateUtil.getCurrentDateAsUTCISOZonedDateTime(),
    notes: '',
};

export default function CreateJobApplication() {
    const {companies, saveCompanyAndRefreshEntries} = useOutletContext() as any;
    const statuses = useContext(StatusesContext);
    const [workingJobApplication, setWorkingJobApplication] = useState(defaultJobApplication);
    const [workingSentDate, setWorkingSentDate] = useState(dateUtil.getLocalTodayForDateInput());
    const [workingResumeFile, setWorkingResumeFile] = useState(undefined as File | undefined);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // TODO: disable company dropdown and button, and also show loader when companies list is still loading

    const createCompanyClickHandler = (e: MouseEvent): void => {
        setShowModal(true);
    }

    const handleCloseModal = (): void => {
        if (!isLoading) {
            setShowModal(false);
        }
    }

    const saveCompany = (company: Company): void => {
        // TODO: validate fields are not empty before sending request, and display validation errors
        setIsLoading(true);
        saveCompanyAndRefreshEntries(
            company
        ).then((company: Company): void => {
            setShowModal(false);
            // TODO: show toast success message
        }).catch((err: Error) => {
            alert(`Failed to create company: ${err.message}`);
            // TODO: error toast
            // TODO: show errors for 400 when failing json schema validation
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const updateStringValue = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        field: 'jobTitle' | 'jobDescription' | 'status' | 'jobPostingUrl' | 'companyId' | 'sentDate' | 'notes'
    ): void => {
        const newWorkingJobApplication: JobApplicationCreatePayload = JSON.parse(
            JSON.stringify(workingJobApplication)
        ) as JobApplicationCreatePayload;

        newWorkingJobApplication[field] = e.currentTarget.value;
        setWorkingJobApplication(newWorkingJobApplication);
    }

    const updateDate = (e: ChangeEvent<HTMLInputElement>): void => {
        const newWorkingJobApplication: JobApplicationCreatePayload = JSON.parse(
            JSON.stringify(workingJobApplication)
        ) as JobApplicationCreatePayload;

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

    const getCompressedB64EncodedFile = (): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            if (workingResumeFile) {
                resolve(transmissionUtil.gzipAndBase64EncodeBlob(workingResumeFile));
            } else {
                reject('Must include a resume file to apply');
            }
        })

    }

    const saveJobApplication = (e: MouseEvent) => {
        e.preventDefault();
        getCompressedB64EncodedFile().then((base64ResumeFile) => {
            workingJobApplication.resume.docxFile = base64ResumeFile;
            fetch(`${apiUrl}/job-applications`, {
                method: 'POST',
                body: JSON.stringify(workingJobApplication),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                // TODO: show success toast
                alert('success');
                setWorkingJobApplication(defaultJobApplication);
                setWorkingSentDate(dateUtil.getLocalTodayForDateInput());
                setWorkingResumeFile(undefined);
                const fileInput = document.getElementById('resume-file') as HTMLInputElement;
                fileInput.value = null;
            }).catch((err) => {
                // TODO: show error toast
                alert('failed')
            }).finally(() => {
                setIsLoading(false);
            });
        }).catch((err) => {
            // TODO: show error toast
            alert(err);
        })
    }

    return (
        <>
            <div className="d-flex flex-column flex-grow-1 p-3 full-scroll">
                <form className="d-flex flex-column">
                    <div className="row mb-3">
                        <div className="col-4">
                            <div className="form-floating input-group">
                                <select
                                    className="form-select"
                                    name="company"
                                    disabled={isLoading}
                                    value={workingJobApplication.companyId}
                                    onChange={(e) => updateStringValue(e, 'companyId')}
                                >
                                    <option value="">Please select or add a company</option>
                                    {
                                        companies.map((company: any) => <option key={company.id}
                                                                                value={company.id}>{company.name}</option>)
                                    }
                                </select>
                                <label htmlFor="company">Company</label>
                                <button className="btn btn-primary" type="button" data-bs-toggle="modal"
                                        data-bs-target="#add-company-modal" onClick={createCompanyClickHandler}>
                                    <FontAwesomeIcon icon={faPlus}/>&nbsp;
                                    Add
                                </button>
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

                        <div className="col-4">
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

                    <div className="form-floating mb-3">
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

                    <div className="row mb-3">
                        <div className="col-4">
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


                        <div className="col-4">
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

                        <div className="col-4">
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
                            value={workingJobApplication.notes}
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
            </div>
            <CreateCompanyModal show={showModal} isLoading={isLoading} handleClose={handleCloseModal}
                                saveCompany={saveCompany}/>
        </>
    );
}
