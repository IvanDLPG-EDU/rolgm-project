import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { UserContext } from '../../contexts';
import { DarkModeSlider, useFormModal } from "../commons";

const loginFormMetadata = {
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

const registerFormMetadata = {
  title: "Register",
  cancelBtn: "Cancelar",
  submitBtn: "Crear",
  fetchMetadata: {
    url: "http://172.18.0.2:8000/auth/register/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }
}


const loginFields = [
  { name: 'username', label: 'Email or Username', type: 'text', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', required: true },
];

const registerFields = [
  { name: 'username', label: 'Username', type: 'text', info: "( a-z 0-9 _ . - )",required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', required: true },
  { name: 'password2', label: 'Confirmar contraseña', type: 'password', required: true },
];

const registerValidators = {
  'username': (username) => {return username.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_.ñ-]/g, "")},
}



const MainNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token, handleLogout, handleLogin, handleRegister, darkMode } = useContext(UserContext);

  const handleNavbarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavLinkClick = () => {
    setIsExpanded(false);
  }
  
  const loginModal = useFormModal()
  const registerModal = useFormModal()

  return (
    <>
      <Navbar className={darkMode ? "bg-dark" : "bg-light"} expand="lg" fixed="top" expanded={isExpanded}>
        <Container>
          <NavLink to="/" className={`navbar-brand ${darkMode ? 'text-light' : 'text-dark'}`}>RolGM</NavLink>
          <Navbar.Toggle onClick={handleNavbarToggle} />
          <Navbar.Collapse className={isExpanded ? "justify-content-end" : ""}>
            <Nav className="me-auto">
              <DarkModeSlider/>
            </Nav>
            <Nav>
              {token && token !== "null" ? (
                <>
                  <NavLink to="/salas" className={`nav-link me-3 ${darkMode ? 'text-light' : 'text-dark'}`} onClick={handleNavLinkClick}>Salas</NavLink>
                  <NavLink to="#" className={`nav-link me-3 ${darkMode ? 'text-light' : 'text-dark'}`} onClick={handleNavLinkClick}>Perfil</NavLink>
                  <NavLink to="/" onClick={handleLogout} className={`nav-link me-3 ${darkMode ? 'text-light' : 'text-dark'}`}>Logout</NavLink>

                </>
              ) : (
                <>
                  <Button variant={ darkMode ? "dark" : "light"} className="me-3" onClick={() => loginModal.setShowModal(true)}>Login</Button>
                  <Button variant={ darkMode ? "dark" : "light"} className="btn-outline-success me-3" onClick={() => registerModal.setShowModal(true)}>Register</Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {token && token !== "null" ? null : (
        <>
          <loginModal.FormModal
            formMetadata={loginFormMetadata}
            fields={loginFields}
            onHide={() => loginModal.setShowModal(false)}
            onSuccess={handleLogin}
          />
          <registerModal.FormModal
            formMetadata={registerFormMetadata}
            fields={registerFields}
            validators= {registerValidators}
            onHide={() => registerModal.setShowModal(false)}
            onSuccess={handleRegister}
          />
        </>
      )}

    </>
  );
};

export default MainNavbar;
