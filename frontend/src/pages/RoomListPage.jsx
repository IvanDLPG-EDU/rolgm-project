import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormModal } from "../components/commons";

const createRoomFormMetadata = {
  title: "Crear Sala",
  cancelBtn: "Cancelar",
  submitBtn: "Crear",
  fetchMetadata: {
    url: "http://172.18.0.2:8000/api/rooms/create/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  }
}


const createRoomFields = [
  { name: 'name', label: 'Nombre', type: 'text', info: "( a-z A-Z 0-9 _ . - )", required: true },
  { name: 'description', label: 'Descripcion', type: 'text' },
  { name: 'max_players', label: 'Capacidad de Jugadores', type: 'number', info: "( -1 = No Max )" },
  { name: 'is_private', label: 'Privado', type: 'checkbox' },
  { name: 'password', label: 'Contraseña', type: 'password', depends_on: 'is_private' },
];

const createRoomValidators = {
  'onChange': {
    'name': (name) => { return name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_.ñÑ-]/g, "") },
  },
  'onBlur': {
    'max_players': (max_players) => max_players && !isNaN(max_players) ? max_players == 0 || max_players < -1 ? -1 : max_players : -1
  }
};

export const RoomListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [createdRoom, setCreatedRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const createRoomModal = useFormModal()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://172.18.0.2:8000/api/rooms/");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, [createdRoom]);

  async function handleSearch(event) {
    event.preventDefault();
    let response = null;

    try {
      if (!searchTerm) {
        response = await fetch("http://172.18.0.2:8000/api/rooms/");
      } else {
        const formattedSearchTerm = searchTerm.replace("#", " ");
        response = await fetch(
          `http://172.18.0.2:8000/api/rooms/search/?search=${formattedSearchTerm}&ordering=name`
        );
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Container className="mt-5" style={{ paddingTop: "20px" }}>
        <Row>
          <Col>
            <div className="d-flex align-items-center mb-3">
              <h1 className="me-3">Buscar Salas</h1>
              <Button variant="primary" onClick={() => createRoomModal.setShowModal(true)}>
                Crear Sala
              </Button>
            </div>
          </Col>
        </Row>
        <Form onSubmit={handleSearch}>
          <Row>
            <Col xs={12} md={8} lg={9} className="mb-3">
              <Form.Control
                type="text"
                placeholder="Ingrese su búsqueda aquí"
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
            </Col>
            <Col xs={12} md={4} lg={3}>
              <Button variant="primary" type="submit">
                Buscar
              </Button>
            </Col>
          </Row>
        </Form>
        <hr />
        <Row>
          {rooms.map((room) => (
            <Col xs={12} md={6} lg={4} key={room.id}>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">{room.name + "#" + room.room_id}</h5>
                  <p className="card-text">{room.created_at}</p>
                  <p className="card-text">
                    Jugadores: {room.player_count} | Espectadores:{" "}
                    {room.spectator_count}{" "}
                  </p>
                  <a
                    href={`/sala/${room.id}/`}
                    className="btn btn-primary"
                  >
                    Ver Sala
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      {createRoomModal.showModal ? (
        <createRoomModal.FormModal
          formMetadata={createRoomFormMetadata}
          fields={createRoomFields}
          validators={createRoomValidators}
          onHide={() => createRoomModal.setShowModal(false)}
          onSuccess={(data) => setCreatedRoom(data)}
        />
      ) : null}
    </>
  );
};

export default RoomListPage;
