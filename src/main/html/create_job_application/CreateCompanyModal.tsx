import React, {ChangeEvent, MouseEvent, useState} from "react";
import {Modal, Spinner} from "react-bootstrap";
import Company from "../types/Company";

interface CreateCompanyModalProps {
    show: boolean;
    isLoading: boolean;
    handleClose: () => void;
    saveCompany: (company: Company) => void;
}

export default function CreateCompanyModal({show, isLoading, handleClose, saveCompany}: CreateCompanyModalProps) {
    const [workingCompany, setWorkingCompany] = useState({
        name: '',
        webSiteUrl: '',
    } as Company);

    // TODO: client-side validation of form fields, with bootstrap integration

    const updateName = (e: ChangeEvent<HTMLInputElement>): void => {
        const newWorkingCompany = JSON.parse(JSON.stringify(workingCompany)) as Company;
        newWorkingCompany.name = e.currentTarget.value
        setWorkingCompany(newWorkingCompany);
    }

    const updateWebSite = (e: ChangeEvent<HTMLInputElement>): void => {
        const newWorkingCompany = JSON.parse(JSON.stringify(workingCompany)) as Company;
        newWorkingCompany.webSiteUrl = e.currentTarget.value;
        setWorkingCompany(newWorkingCompany);
    }

    const handleSaveCompany = (e: MouseEvent) => {
        e.preventDefault();
        saveCompany(workingCompany);
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Company</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" name="company-name" value={workingCompany.name} onChange={updateName}/>
                        <label htmlFor="company-name">Company Name</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" name="company-website" value={workingCompany.webSiteUrl} onChange={updateWebSite}/>
                        <label htmlFor="company-website">Company Website</label>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    disabled={isLoading}
                    onClick={(e) => handleClose()}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isLoading}
                    onClick={handleSaveCompany}
                >
                    {isLoading ? <Spinner animation="border" as="span" size="sm" role="status" /> : 'Add'}
                </button>
            </Modal.Footer>
        </Modal>
    )
}