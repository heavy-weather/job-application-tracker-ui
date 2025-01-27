import * as React from 'react';
import {Outlet} from 'react-router-dom';
import NavigationBar from "./NavigationBar";

export default function Layout() {
    return (
        <div className="d-flex w-100 flex-grow-1 bg-light">
            <NavigationBar />
            <div className="d-flex flex-column flex-grow-1">
                <Outlet />
            </div>
        </div>
    )
}

/*
Error handling:
    network error:
    5xx:           display message asking client to retry after some time
    4xx:           most n/a for now
        400:       display message detailing the error

    3xx:           n/a for now
 */