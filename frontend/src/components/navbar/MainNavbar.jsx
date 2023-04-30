import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { UserContext } from '../../contexts';

const MainNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token, handleLogout } = useContext(UserContext);

  const handleNavbarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavLinkClick = () => {
    setIsExpanded(false);
  }

  return (
    <Navbar bg="light" expand="lg" fixed="top" expanded={isExpanded}>
      <Container>
      <NavLink to="/" className="navbar-brand">RolGM</NavLink>
        <Navbar.Toggle onClick={handleNavbarToggle} />
        <Navbar.Collapse className={isExpanded ? "justify-content-end" : ""}>
          <Nav className="me-auto">

          </Nav>
          <Nav>
            {token && token !== "null" ? (
              <>
                <NavLink to="/salas" className="nav-link me-3" onClick={handleNavLinkClick}>Salas</NavLink>
                <NavLink to="#" className="nav-link me-3" onClick={handleNavLinkClick}>Perfil</NavLink>
                <NavLink to="/login" onClick={handleLogout} className="nav-link me-3">Logout</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link me-3" onClick={handleNavLinkClick}>Login</NavLink>
                <NavLink to="/registration" className="btn btn-outline-success me-3" onClick={handleNavLinkClick}>
                  Registrarse
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
