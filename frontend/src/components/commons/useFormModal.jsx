import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const useFormModal = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const FormModal = ({ formMetadata, fields, onHide, onSuccess = null}) => {
        const {title, cancelBtn, submitBtn, fetchMetadata} = formMetadata
        const {url, method, headers} = fetchMetadata

        const handleSubmit = (event) => {
            event.preventDefault();

            const formData = {};
            fields.forEach((field) => {
                formData[field.name] = event.target.elements[field.name].value;
            });

            console.log("FORM_DATA: ", formData)

            fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    // if (data.token) {
                    //     handleErrors(null);
                    //     navigate("/");
                    // } else {
                    //     handleErrors(data);
                    // }
                    console.log("Data", data)
                    setShowModal(false)
                    onSuccess(data)
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        return (
            <Modal show={showModal} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title || "Formulario"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {fields.map((field) => (
                            <Form.Group key={field.name} controlId={field.name}>

                                <Form.Label>{field.label}</Form.Label>

                                <Form.Control
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder || null}
                                    defaultValue={field.default || null}
                                    disabled={field.disabled || false}
                                    required={field.required || false}

                                />

                            </Form.Group>
                        ))}
                        <div className="d-flex justify-content-end mt-3 gap-3">
                            <Button variant="secondary" onClick={onHide} className="mr-2">
                                {cancelBtn || "Cancelar"}
                            </Button>
                            <Button type="submit" variant="primary">
                                {submitBtn || "Enviar"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    };


    return { setShowModal, FormModal }
}

export default useFormModal;