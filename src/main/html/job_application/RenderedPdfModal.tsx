import React, {useEffect, useState, MouseEvent} from "react";
import {Modal} from "react-bootstrap";

interface RenderedPdfModalProps {
    pdfFile: Blob;
    show: boolean;
    handleClose: () => void;
}

export default function RenderedPdfModal({pdfFile, show, handleClose}: RenderedPdfModalProps) {
    const [pdfObjectUrl] = useState(URL.createObjectURL(pdfFile));
    useEffect(() => {
        return () => {
            // URL.revokeObjectURL(pdfObjectUrl);
        }
    }, []);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            fullscreen={true}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Last saved resume</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <iframe
                    style={{'width': '100%', 'height': '100%'}}
                    src={pdfObjectUrl}
                    loading="lazy"
                    title="Resume"
                ></iframe>
            </Modal.Body>
        </Modal>
    )
}