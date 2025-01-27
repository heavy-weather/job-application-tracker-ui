import * as React from 'react';
import {Outlet, useLoaderData, useOutletContext} from 'react-router-dom';
import { apiUrl } from "../ApiUrl";
import JobApplication from "../types/JobApplication";

export async function jobApplicationLoader({params}: any) {
    const response = await fetch(`${apiUrl}/job-applications/${params.jobApplicationId}`);

    if (!response.ok) {
        if (response.status === 400) {
            throw new Response(await response.json(), {status: response.status});
        } else {
            throw new Response(response.statusText, {status: response.status});
        }

    }
    return {jobApplication: await response.json()};
}

export default function JobApplicationContainer() {
    const { jobApplication, } = useLoaderData() as {jobApplication: JobApplication};
    const { revalidateJobApplications } = useOutletContext() as {revalidateJobApplications: () => void};
    return (
        <Outlet context={{jobApplication, revalidateJobApplications}} />
    )
}
