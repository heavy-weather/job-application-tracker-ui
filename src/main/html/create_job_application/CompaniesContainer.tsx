import * as React from 'react';
import {Outlet, useLoaderData, useRevalidator} from "react-router-dom";
import { apiUrl } from '../ApiUrl';
import Company from "../types/Company";

export async function companiesLoader({request}: any) {
    const fetchCompanies = async () => fetch(`${apiUrl}/companies`);
    let response = await fetchCompanies();
    while (!response.ok && response.status >= 500) {
        response = await fetchCompanies();
    }

    if (!response.ok) {
        throw new Response(response.statusText, {status: response.status})
    }

    return {companies: await response.json()};
}

export default function CompaniesContainer() {
    const {companies} = useLoaderData() as any;
    const revalidator = useRevalidator();

    const saveCompanyAndRefreshEntries = (company: Company): Promise<any> => {
        return fetch(`${apiUrl}/companies`, {
            method: 'POST',
            body: JSON.stringify(company),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }

            revalidator.revalidate();
            return res.json();
        })
    }

    return (
        <Outlet context={{companies, saveCompanyAndRefreshEntries}} />
    )
}
