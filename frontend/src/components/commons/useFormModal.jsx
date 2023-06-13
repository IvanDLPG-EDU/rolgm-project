import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { UserContext } from "../../contexts";


const useFormModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [formErrors, setFormErrors] = useState("")
    const { darkMode } = useContext(UserContext);
    const FormModal = ({ formMetadata, fields, validators, onHide, onSuccess = null }) => {
        const { title, cancelBtn, submitBtn, fetchMetadata } = formMetadata
        const { url, method, headers } = fetchMetadata

        const [formData, setFormData] = useState({})

        const _onHide = (e) => {
            setFormErrors("")
            onHide(e)
        }

        useEffect(() => {
            // Establecer los valores predeterminados del formulario en formData
            const defaultFormData = {};
            fields.forEach((field) => {
                if (field.default) {
                    defaultFormData[field.name] = field.default;
                } else {
                    defaultFormData[field.name] =
                        field.type == "number"
                            ? 1
                            : field.type == "checkbox"
                                ? false
                                : ""
                }
            });
            setFormData(defaultFormData);
        }, [fields]);

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            if (validators && validators.onChange && name in validators.onChange) {
                const validatedValue = validators.onChange[name](value);
                setFormData((prevFormData) => ({ ...prevFormData, [name]: validatedValue }));

            } else {
                if (type === 'checkbox') {
                    setFormData((prevFormData) => ({ ...prevFormData, [name]: checked }));
                } else {
                    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
                }
            }
        };

        const handleBlur = (event) => {
            const { name, value } = event.target;

            if (validators && validators.onBlur && name in validators.onBlur) {
                const validatedValue = validators.onBlur[name](value);
                setFormData((prevFormData) => ({ ...prevFormData, [name]: validatedValue }));

            }
        }

        const handleErrors = (errors) => {
            let newErrors = {
            };
            
            if (errors) {
                for (const [key, value] of Object.entries(errors)) {
                    newErrors[key] = value[0];
                }
            }
            
            setFormErrors(newErrors);
        };

        const handleSubmit = (event) => {
            event.preventDefault();

           

            fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    
                    if (data.errors) {
                        handleErrors(data.errors);
                    } else {
                        setShowModal(false)
                        setFormErrors("")
                        onSuccess(data)
                    }

                })
                .catch((error) => {
                    console.error("a:", error);
                });
        };

        return (
            <Modal className={darkMode ? 'dark-modal' : 'light-modal'} show={showModal} onHide={_onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{title || "Formulario"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {fields.map((field) => (
                            <Form.Group key={field.name} controlId={field.name} hidden={field.depends_on ? !formData[field.depends_on] : false}>
                                <Form.Label>{field.label}</Form.Label>
                                <span style={{ color: "gray", fontSize: "0.8em", marginLeft: "5px" }}>
                                    {field.info ? field.info : null}
                                </span>
                                {field.type === "checkbox" ? (
                                    <Form.Check
                                        name={field.name}
                                        label={field.label}
                                        checked={formData[field.name] || false}
                                        onChange={handleChange}
                                        disabled={field.disabled || false}
                                        required={field.required || false}
                                        isInvalid={formErrors[`${field.name}`]}
                                    />
                                ) : (
                                    <Form.Control
                                        className={`${formErrors[`${field.name}`] && "is-invalid"}`}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder || null}
                                        disabled={field.disabled || false}
                                        required={field.required || false}
                                        onChange={handleChange}
                                        onBlur={validators && validators.onBlur && field.name in validators.onBlur ? handleBlur : null}
                                        value={formData[field.name] || ""}
                                    />
                                )}
                                {formErrors[`${field.name}`] && <div className="alert text-danger">{formErrors[`${field.name}`]}</div>}
                            </Form.Group>
                        ))}
                        <div className="d-flex justify-content-end mt-3 gap-3">
                            <Button variant="secondary" onClick={_onHide} className="mr-2">
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


    return { setShowModal, showModal, FormModal }
}

export default useFormModal;