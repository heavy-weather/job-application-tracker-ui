import * as React from 'react';
import JobApplication from "../types/JobApplication";
import dateUtil from '../util/DateUtil';
import {Outlet, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {useState} from "react";

export default function JobApplications() {
    const {jobApplications, revalidateJobApplications} = useOutletContext() as {jobApplications: JobApplication[], revalidateJobApplications: () => void};
    const [activeJobApplicationId, setActiveJobApplicationId] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const handleRowClick = (jobApplicationId: string) => {
        navigate(`/job-applications/${jobApplicationId}/edit`);
        setActiveJobApplicationId(jobApplicationId);
    }

    if (location.pathname !== '/job-applications' && !activeJobApplicationId) {
        setActiveJobApplicationId(
            location.pathname
                .replace('/job-applications/', '')
                .replace('/edit', '')
        );
    } else if (location.pathname === '/job-applications' && activeJobApplicationId) {
        setActiveJobApplicationId(undefined);
    }

    return (
        <div className="d-flex flex-column h-100 p-3" style={{gap: '1rem'}}>
            <div className="d-flex flex-column full-scroll max-h-75">
                <table className="table table-hover mb-0 table-fixed">
                    <colgroup>
                        <col span={1} style={{width: '15%'}}></col>
                        <col span={1} style={{width: '40%'}}></col>
                        <col span={1} style={{width: '35%'}}></col>
                        <col span={1} style={{width: '10%'}}></col>
                    </colgroup>
                    <thead className="table-dark">
                    <tr>
                        <th>Date Submitted</th>
                        <th>Job Title</th>
                        <th>Company Name</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        jobApplications.map((jobApplication) =>
                            <TableRow
                                key={jobApplication.id}
                                jobApplication={jobApplication}
                                activeJobApplicationId={activeJobApplicationId}
                                handleClick={handleRowClick}
                            />
                        )
                    }
                    </tbody>
                </table>
            </div>
            <div className="d-flex flex-column full-scroll min-h-25 max-h-content">
                <Outlet context={{revalidateJobApplications}} />
            </div>
        </div>
    )
}

interface TableRowProps {
    jobApplication: JobApplication;
    activeJobApplicationId: string;
    handleClick: Function
}

function TableRow(props: TableRowProps) {
    const [isActive, setIsActive] = useState(false);
    const jobApplication = props.jobApplication

    if (!isActive && props.jobApplication.id === props.activeJobApplicationId) {
        setIsActive(true);
    } else if (isActive && props.jobApplication.id !== props.activeJobApplicationId) {
        setIsActive(false)
    }

    return (
        <tr
            id={jobApplication.id}
            key={jobApplication.id}
            onClick={(e) => props.handleClick(jobApplication.id)}
            className={`cursor-pointer ${isActive ? 'table-primary' : ''}`}
        >
            <td>{dateUtil.formatReadableDate(jobApplication.sentDate)}</td>
            <td>{jobApplication.jobTitle}</td>
            <td>{jobApplication.company.name}</td>
            <td>
                <span className={'badge bg-' + getStatusColor(jobApplication.status)}>
                    {jobApplication.status}
                </span>
            </td>
        </tr>
    );
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'ACTIVE':
            return 'light text-dark';
        case 'REJECTED':
            return 'danger';
        case 'ADVANCED':
            return 'success';
        case 'INACTIVE':
            return 'secondary';
        case 'IN_PROGRESS':
                return 'primary';
        default:
            return 'dark'
    }
}