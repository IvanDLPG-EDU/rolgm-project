import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export const RoomList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Aquí deberías hacer una petición a la API para obtener todas las salas
    // Ejemplo: fetchRooms();
    // Una vez que tengas la respuesta de la API, actualiza el estado de las salas con setRooms
    // Ejemplo: setRooms(response.data);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    // Aquí deberías hacer una petición a la API con el término de búsqueda
    // Ejemplo: fetchRoomsBySearchTerm(searchTerm);
    // Una vez que tengas la respuesta de la API, actualiza el estado de las salas con setRooms
    // Ejemplo: setRooms(response.data);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container>
      <h1>Buscar Salas</h1>
      <Form onSubmit={handleSearch}>
        <Row>
          <Col xs={12} md={8} lg={9}>
            <Form.Control
              type="text"
              placeholder="Ingrese su búsqueda aquí"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </Col>
          <Col xs={12} md={4} lg={3}>
            <Button variant="primary" type="submit" block>
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
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">{room.description}</p>
                <a href={`/salas/${room.id}`} className="card-link">
                  Ver Sala
                </a>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};