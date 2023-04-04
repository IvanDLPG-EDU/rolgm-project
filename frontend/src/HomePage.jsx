import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  return (
    <>
      
      <Container>
            <h1>Bienvenido a RolGM</h1>
            <p>Esta es la página principal, desde aquí puedes acceder a diferentes secciones de la aplicación.</p>
        </Container>


      <Container className="my-5">
        <Row>
          <Col xs={12} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Salas de Rol</Card.Title>
                <Card.Text>
                  Explora y encuentra nuevas salas de rol para unirte y jugar con otros usuarios.
                </Card.Text>
                <Link to="/sala-debug" className="btn btn-primary">
                  Sala Random
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Tu Perfil</Card.Title>
                <Card.Text>
                  Gestiona tu perfil de usuario, incluyendo tus preferencias, información personal y avatar.
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
