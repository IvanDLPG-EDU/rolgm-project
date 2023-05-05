import React, { useContext, useState, useEffect } from "react";
import { RoomContext } from "../../../contexts";
import { ListGroup, Button, Container } from "react-bootstrap";
import { FormModal } from "../../commons"

const fields = [
  { name: 'name', label: 'Nombre', type: 'text' },
  { name: 'player_id', label: 'Player ID', type: 'number' },
];

const fixedValues = {
  player_id: 1,
};

const Character = () => {
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState("");
  const { characterList } = useContext(RoomContext);


  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Recopilar los valores de los campos de formulario
    const formData = {};
    fields.forEach((field) => {
      formData[field.name] = event.target.elements[field.name].value;
    });
  
    // Agregar los valores al objeto del estado de respuesta
    setResponse({ ...formData });
  
    // Cerrar el modal
    setShowModal(false)
  };


  useEffect(() => {
    console.log(response)
  }, [response])
  

  return (
    <>
      <Container>
        <h1 className="my-4">Listado de personajes</h1>
        <Button variant="primary" className="mb-4" onClick={() => setShowModal(true)}>Crear personaje</Button>
        {characterList.length ? (
          <ListGroup>
            {characterList.map((character) => (
              <ListGroup.Item key={character.id}>{character.name}</ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="mt-4">Parece que aún no hay personajes.</p>
        )}
      </Container>

      <FormModal
        fields={fields}
        fixedValues={fixedValues}
        handleFormSubmit={handleFormSubmit}
        show={showModal}
        onHide={() => setShowModal(false)}
      />

    </>
  );
};

export default Character;

