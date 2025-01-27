import * as React from 'react';
import {Outlet, useLoaderData} from 'react-router-dom';
import {apiUrl} from "./ApiUrl";
import {StatusesContext} from "./context/StatusesContext";

export async function statusLoader({params}: any) {
    const makeRequest = async () => await fetch(`${apiUrl}/statuses`);
    let response = await makeRequest();
    while (!response.ok && response.status >= 500) {
        console.debug('Request for /statuses failed, retrying...');
        response = await makeRequest();
    }

    if (!response.ok) {
        throw new Response(response.statusText, {status: response.status});
    }
    return { statuses: await response.json() };
}

export default function ApplicationContainer() {
    const {statuses} = useLoaderData() as {statuses: string[]};

    return (
        <StatusesContext.Provider value={statuses}>
            <Outlet context={{statuses}} />
        </StatusesContext.Provider>
    )
}
