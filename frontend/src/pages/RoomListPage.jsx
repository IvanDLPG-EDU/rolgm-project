import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
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
  { name: 'name', label: 'Nombre', type: 'text', info: "( a-z A-Z 0-9 _ . - )",required: true },
  { name: 'description', label: 'Descripcion', type: 'text' },
  { name: 'max_players', label: 'Capacidad de Jugadores', type: 'number', info: "( a-z A-Z 0-9 _ . - )" },
  { name: 'is_private', label: 'Privado', type: 'checkbox' },
  { name: 'password', label: 'Contraseña', type: 'password' },
];

const createRoomValidators = {
  'username': (username) => {return username.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_.ñ-]/g, "")},
}

export const RoomListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
  }, []);

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
                CrearConModal /ComentariosEnCode/
              </Button> 

              {/* 
              //////////////////////////////////////  El checkbox no debe tener form-control 
              /////////////////////////////////////   Hay que añadir la capacidad de "si x checkbox == True..."
              
              ////////////////////////////////////    Una buena forma es poner el nombre del campo del que depende
              ///////////////////////////////////     Es decir, dependsOn 
              */}

              <Button as={Link} to="/salas/crear" variant="primary">
                CrearConPAGINA
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
      <createRoomModal.FormModal
        formMetadata={createRoomFormMetadata}
        fields={createRoomFields}
        validators= {createRoomValidators}
        onHide={() => createRoomModal.setShowModal(false)}
        onSuccess={()=> console.log("Created")}
      />
    </>
  );
};

export default RoomListPage;
