import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';

const FormModal = ({ show, onHide, fields, handleFormSubmit, fixedValues }) => {

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Formulario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          {fields.map((field) => (
            <Form.Group key={field.name} controlId={field.name}>
              <Form.Label>{field.label}</Form.Label>
              {fixedValues[field.name] ? (
                <Form.Control
                  type={field.type}
                  name={field.name}
                  defaultValue={fixedValues[field.name]}
                  disabled
                />
              ) : (
                <Form.Control type={field.type} name={field.name} />
              )}
            </Form.Group>
          ))}
          <div className="d-flex justify-content-end mt-3 gap-3">
            <Button variant="secondary" onClick={onHide} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Enviar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormModal;
