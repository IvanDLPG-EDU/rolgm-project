import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { UserContext } from '../../contexts';

const MainNavbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { token, handleLogout } = useContext(UserContext);
  const handleNavbarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/">RolGM</Navbar.Brand>
        <Navbar.Toggle onClick={handleNavbarToggle} />
        <Navbar.Collapse className={isCollapsed ? "justify-content-end" : ""}>
          <Nav className="me-auto">
            
          </Nav>
          <Nav>
            {token && token !== "null" ? (
              <>
                <NavLink to="/salas" className="nav-link me-3">Salas</NavLink>
                <NavLink to="#" className="nav-link me-3">Perfil</NavLink>
                <NavLink to="/login" onClick={handleLogout} className="nav-link me-3">Logout</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link me-3">Login</NavLink>
                <Button variant="outline-success" href="/registration" className="me-3">
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
