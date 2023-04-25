import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container,Button } from 'react-bootstrap';

export const MainNavbar = () => {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">RolGM</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/salas">Salas</Nav.Link>
              {/* <Nav.Link href="/perfil">Mi perfil</Nav.Link>
              <Nav.Link href="/login">Iniciar sesión</Nav.Link> */}
            </Nav>
            <Button variant="outline-success">Registrarse</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default MainNavbar;