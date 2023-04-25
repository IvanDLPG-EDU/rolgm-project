import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const HomePage = () => {

  fetch('http://172.18.0.2:8000/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin',
      })
    })
      .then(response => {
          return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });

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

export default HomePage;