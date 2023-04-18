import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export const RoomList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const backendIP = import.meta.env.VITE_SERVER_HOST;
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://172.18.0.2:8000/api/rooms/');
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
    try {
      const response = await fetch(`http://172.18.0.2:8000/api/rooms/search/?search=${searchTerm}`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error(error);
    }
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
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">{room.created_at}</p>
                <p className="card-text">Jugadores: {room.players.filter(player => player.game_mode === "p").length} | Espectadores: {room.players.filter(player => player.game_mode === "s").length} </p>
                <a href={`/salas/${room.id}`} className="btn btn-primary">
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