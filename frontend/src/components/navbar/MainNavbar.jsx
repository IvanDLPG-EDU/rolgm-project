import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container,Button } from 'react-bootstrap';

export const MainNavbar = () => {
  const [isAbsolute, setIsAbsolute] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      if (position === 0) {
        setIsAbsolute(true);
      } else {
        setIsAbsolute(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <Navbar bg="light" expand="lg" className={isAbsolute ? 'absolute' : ''} fixed="top">
        <Container>
          <Navbar.Brand href="/">RolGM</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="/salas">Salas</Nav.Link>
              {/* <Nav.Link href="/perfil">Mi perfil</Nav.Link>*/}
            </Nav>
            <Nav>
              <Nav.Link href="/login">Iniciar sesión</Nav.Link>
              <Button variant="outline-success" href="/registration">Registrarse</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
  
}


export default MainNavbar;