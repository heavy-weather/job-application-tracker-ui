import * as React from 'react';
import {apiUrl} from "../ApiUrl";
import {Outlet, useLoaderData, useRevalidator} from "react-router-dom";

export async function jobApplicationsLoader({request, params}: any) {
    const searchParams = new URLSearchParams(params);
    searchParams.set('partial', 'true');
    const fetchJobApplications = async () => await fetch(`${apiUrl}/job-applications?${searchParams.toString()}`);

    let response = await fetchJobApplications();
    while (!response.ok && response.status >= 500) {
        response = await fetchJobApplications();
    }

    if (!response.ok) {
        throw new Response(response.statusText, {status: response.status});
    }
    return {jobApplications: await response.json()};
}

export default function JobApplicationsContainer() {
    const { jobApplications } = useLoaderData() as any;
    const revalidator = useRevalidator();

    const revalidateJobApplications = (): void => {
        revalidator.revalidate();
    }

    return (
        <Outlet context={{jobApplications, revalidateJobApplications}} />
    )
}
