import React, { useState, useEffect, useContext, useRef } from "react";
import { RoomContext } from "../../../contexts";
import { ListGroup, Button, Container } from "react-bootstrap";

const Character = () => {
  const { activeRoom, characterList } =
    useContext(RoomContext);
  
  return (
    <Container>
      <h1>Listado de personajes</h1>
      <Button variant="primary">Crear personaje</Button>

      {characterList.length ? (
        <ListGroup>
          {characterList.map((character) => (
            <ListGroup.Item key={character.id}>
              {character.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Parece que aún no hay nadie.</p>
      )}
      
    </Container>
  );
};

export default Character;
