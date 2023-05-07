import React, { useContext, useState, useEffect } from "react";
import { RoomContext } from "../../../contexts";
import { ListGroup, Button, Container } from "react-bootstrap";
import { FormModal1, useFormModal } from "../../commons"

const formMetadata = {
  title: "Crear Personaje",
  cancelBtn: "Cancelar",
  submitBtn: "Enviar",
  fetchMetadata: {
    url: "http://172.18.0.2:8000/api/character/create/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  }
}

const Character = () => {
  const { characterList, setCharacterList, roomData } = useContext(RoomContext);
  const { ownPlayer } = roomData
  const { setShowModal, FormModal } = useFormModal()

  const fields = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'player_id', label: 'Player ID', type: 'number', disabled: true, default: ownPlayer.id },
  ];

  const updateCharacterList = async (data) => {
      setCharacterList([...characterList, data]);
  };


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
        formMetadata={formMetadata}
        fields={fields}
        onHide={() => setShowModal(false)}
        onSuccess={updateCharacterList}
      />

    </>
  );
};

export default Character;

