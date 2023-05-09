import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { UserContext } from '../../contexts';
import { useFormModal } from "../commons";

const MainNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token, setToken, setUser, handleLogout, handleLogin } = useContext(UserContext);

  const handleNavbarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavLinkClick = () => {
    setIsExpanded(false);
  }

  const { setShowModal, FormModal } = useFormModal()

  const formMetadata = {
    title: "Login",
    cancelBtn: "Cancelar",
    submitBtn: "Entrar",
    fetchMetadata: {
      url: "http://172.18.0.2:8000/auth/login/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  }

  const fields = [
    { name: 'username', label: 'Email or Username', type: 'text', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
  ];


  return (
    <>
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
                  <NavLink to="/" onClick={handleLogout} className="nav-link me-3">Logout</NavLink>
                  
                </>
              ) : (
                <>
                  {/* <NavLink to="/login" className="nav-link me-3" onClick={handleNavLinkClick}>Login</NavLink> */}
                  <Button variant="light" className="me-3" onClick={() => setShowModal(true)}>Login</Button>
                  <NavLink to="/registration" className="btn btn-outline-success me-3" onClick={handleNavLinkClick}>
                    Registrarse
                  </NavLink>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {token && token !== "null" ? null : (
        <FormModal
          formMetadata={formMetadata}
          fields={fields}
          onHide={() => setShowModal(false)}
          onSuccess={handleLogin}
        />
    )}
    
  </>
  );
};

export default MainNavbar;
