import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { UserContext } from "../contexts";
import ReactPaginate from "react-paginate";

const backend_url = import.meta.env.VITE_API_URL;

export const RoomListPage = () => {
  const { darkMode } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [url, setUrl] = useState(window.location.pathname === "/mis-partidas" ? `${backend_url}/api/own-rooms/` : `${backend_url}/api/rooms/`);
  const [currentPage, setCurrentPage] = useState(0);
  const roomsPerPage = 6;

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (!searchTerm) {
        response = await fetch(url, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
      } else {
        const formattedSearchTerm = searchTerm.replace("#", " ");
        response = await fetch(
          `${backend_url}/api/rooms/search/?search=${formattedSearchTerm}&ordering=name`,
          { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
        );
      }

      const data = await response.json();
      setRooms(data);
      setCurrentPage(0); // Reset to first page when searching
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const slicedRooms = rooms.slice(
    currentPage * roomsPerPage,
    (currentPage + 1) * roomsPerPage
  );

  const pageCount = Math.ceil(rooms.length / roomsPerPage);

  return (
    <Container
      fluid
      className={`bg-custom-${darkMode ? "dark" : "light"}`}
      style={{ height: "100vh", padding: "0 30px" }}
    >
      <Row style={{ paddingTop: "80px" }}>
        <Col>
          <div className="d-flex align-items-center mb-3">
            <h1 className="me-3">Buscar Salas</h1>
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
        {slicedRooms.map((room) => (
          <Col xs={12} md={6} lg={4} key={room.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  {room.name}#{room.room_id}
                </h5>
                <p className="card-text">{room.created_at}</p>
                <p className="card-text">
                  Jugadores: {room.player_count} | Espectadores: {room.spectator_count}
                </p>
                <a
                  href={window.location.pathname === "/mis-partidas" ? `/sala/${room.id}` : `/sala/${room.id}/detail`}
                  className="btn btn-primary"
                >
                  Ver Sala
                </a>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Row>
        <Col className="d-flex justify-content-center mt-4">
          <ReactPaginate
            previousLabel={"Anterior"}
            nextLabel={"Siguiente"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination justify-content-center"}
            subContainerClassName={"pagination"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            breakClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default RoomListPage;
