import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CarouselComponent } from "../components";

export const HomePage = () => {
  const images = [
    {
      src: "/media/home-slide1.jpg",
      alt: "Bienvenido a RolGM",
      title: "¡Bienvenido a RolGM!",
      description: "Esperamos que disfrutes de tu estancia en nuestra Web.",
    },
    {
      src: "/media/home-slide2.jpg",
      alt: "¿No sabes por dónde empezar?",
      title: "¿No sabes por dónde empezar?",
      description:
        "Si ya estás registrado, ¿por qué no creas o te unes a una sala?",
    },
    {
      src: "/media/home-slide3.jpg",
      alt: "Las malas lenguas hablan",
      title: "¡Se rumorea algo!",
      description: "¿Escuchaste eso? Hablan sobre una actualización mayor...",
    },
  ];
  return (
    <>
      <CarouselComponent images={images} />

      <Container className="mt-4">
        <h1>Bienvenido a RolGM</h1>
        <p>
          Esta es la página principal, desde aquí puedes acceder a diferentes
          secciones de la aplicación.
        </p>
      </Container>

      <Container className="my-5">
        <Row>
          <Col xs={12} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Salas de Rol</Card.Title>
                <Card.Text>
                  Explora y encuentra nuevas salas de rol para unirte y jugar
                  con otros usuarios.
                </Card.Text>
                <Link to="/sala/sala-debug" className="btn btn-primary">
                  Sala Debug
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Tu Perfil</Card.Title>
                <Card.Text>
                  Gestiona tu perfil de usuario, incluyendo tus preferencias,
                  información personal y avatar.
                </Card.Text>
                <Link to="/" className="btn btn-primary">
                  Ver Perfil
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
