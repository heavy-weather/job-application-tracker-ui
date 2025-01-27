import * as React from 'react';
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faRectangleList} from "@fortawesome/free-solid-svg-icons";
import {faFileLines} from '@fortawesome/free-regular-svg-icons'

export default function NavigationBar() {
    const location = useLocation();
    const jobApplicationsActive = (location: string): string => {
        if (location.startsWith('/job-applications') && !location.includes('create')) {
            return 'active'
        }
        return '';
    }

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: '320px'}}>
            <Link to={'/'} className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <FontAwesomeIcon className="me-2" style={{fontSize: '1.6rem'}} icon={faFileLines} />&nbsp;
                <span className="fs-4">Job Application Tracker</span>
            </Link>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to={'/job-applications'} className={`nav-link text-white ${jobApplicationsActive(location.pathname)}`}>
                        <FontAwesomeIcon className="me-2" icon={faRectangleList} />&nbsp;
                        View All
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to={'/job-applications/create'} className={`nav-link text-white ${location.pathname === '/job-applications/create' ? 'active' : ''}`}>
                        <FontAwesomeIcon className="me-2" icon={faPlus} />&nbsp;
                        Create
                    </Link>
                </li>
            </ul>
            <hr/>
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                   id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://github.com/mdo.png" alt="" width="32" height="32"
                         className="rounded-circle me-2"/>
                    <strong>mdo</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a className="dropdown-item" href="#">New project...</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
    )
}