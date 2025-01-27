import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import JobApplicationsContainer, {jobApplicationsLoader} from "./job_applications/JobApplicationsContainer";
import JobApplicationContainer, { jobApplicationLoader } from "./job_application/JobApplicationContainer";
import CreateJobApplication from "./create_job_application/CreateJobApplication";
import EditJobApplication from "./job_application/EditJobApplication";
import ApplicationContainer, {statusLoader} from "./ApplicationContainer";
import Layout from "./Layout";
import JobApplications from "./job_applications/JobApplications";
import CompaniesContainer, {companiesLoader} from "./create_job_application/CompaniesContainer";

const router = createBrowserRouter([
    {
        path: '/',
        element: <ApplicationContainer />,
        loader: statusLoader,
        children: [
            {
                path: '',
                element: <Layout />,
                children: [
                    {
                        path: 'job-applications',
                        loader: jobApplicationsLoader,
                        element: <JobApplicationsContainer />,
                        children: [
                            {
                               path: '',
                                element: <JobApplications />,
                                children: [
                                    {
                                        path: ':jobApplicationId',
                                        element: <JobApplicationContainer />,
                                        loader: jobApplicationLoader,
                                        children: [
                                            {
                                                path: 'edit',
                                                element: <EditJobApplication />
                                            }
                                        ]
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        path: 'job-applications/create',
                        element: <CompaniesContainer />,
                        loader: companiesLoader,
                        children: [
                            {
                                path: '',
                                element: <CreateJobApplication />
                            }
                        ]
                    }
                ]
            },
        ]
    }
])

export default function App() {
    return (
        <RouterProvider router={router} />
    )
}

/*
    Pages:
/                        | Redirects to /job-applications
/job-applications        | Paginated table showing all submitted job descriptions. Is filterable and sortable on all fields.
/job-applications/{id}   | Page showing a job application, it's fields, and a rendered PDF of the resume used
/job-applications/create | Page allowing creation of job application. Includes:
                                                                        - a company picker
                                                                        - a means to create new companies (modal?)
                                                                        - a text box for the job description
                                                                        - a file upload for the .docx or .pdf resume used
 */