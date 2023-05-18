import React, { useState, useContext, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown, Image } from "react-bootstrap";
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
  { name: 'username', label: 'Username', type: 'text', info: "( a-z 0-9 _ . - )", required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', required: true },
  { name: 'password2', label: 'Confirmar contraseña', type: 'password', required: true },
];

const registerValidators = {
  'onChange': {
    'username': (username) => { return username.toLowerCase().replace(/ /g, "_").replace(/[^a-z0-9_.ñ-]/g, "") },
  },
  'onBlur': {
    'max_players': (max_players) => max_players && !isNaN(max_players) ? max_players == 0 || max_players < -1 ? -1 : max_players : -1
  }
};

const aspects = {
  'dark': {
    'bg': 'bg-dark',
    'text': 'text-light',
    'general': 'dark',
    'lightBtn': 'outline-light',
    'darkBtn': 'light',
  },
  'light': {
    'bg': 'bg-light',
    'text': 'text-dark',
    'general': 'light',
    'lightBtn': 'dark',
    'darkBtn': 'outline-dark',
  }
}

const UserImage = (
  <Image
    src={'https://avatars.githubusercontent.com/u/105361339?s=400&v=4'}
    alt="UserName profile image"
    roundedCircle
    style={{ width: '27px', marginLeft: '10px' }}
  />
)

const MainNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token, handleLogout, handleLogin, handleRegister, darkMode } = useContext(UserContext);

  const handleNavbarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const loginModal = useFormModal()
  const registerModal = useFormModal()



  const [pageAspect, setPageAspect] = useState(darkMode ? aspects['dark'] : aspects['light'])
  useEffect(() => {
    setPageAspect(darkMode ? aspects['dark'] : aspects['light'])

  }, [darkMode])


  return (
    <>
      <Navbar className={pageAspect.bg} expand="lg" fixed="top" expanded={isExpanded}>
        <Container>
          <NavLink to="/" className={`navbar-brand ${pageAspect.text}`}>RolGM</NavLink>
          <Navbar.Toggle onClick={handleNavbarToggle} />
          <Navbar.Collapse className={isExpanded ? "justify-content-end" : ""}>
            <Nav className="me-auto">
              <DarkModeSlider />
            </Nav>
            <Nav>
              {token && token !== "null" ? (
                <>

                  <Nav.Link href="/noticias" className={`nav-link me-3 ${pageAspect.text}`}>Noticias</Nav.Link>
                  <Nav.Link href="/foro" className={`nav-link me-3 ${pageAspect.text}`}>Foro</Nav.Link>
                  <NavDropdown title="Juegos" id="basic-nav-dropdown" menuVariant={pageAspect.general} className={pageAspect.text}>
                    <NavDropdown.Item href="/mis-partidas">Mis Partidas</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/crear-partida">Crear Partida</NavDropdown.Item>
                    <NavDropdown.Item href="/salas">Unirme a Partida</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title={UserImage}  id="basic-nav-dropdown" menuVariant={pageAspect.general} className={pageAspect.text}>
                    <NavDropdown.Item>
                      <div>
                        <p>DoSketchCode</p>
                        <p>@admin</p>
                      </div>
                    </NavDropdown.Item>

                    <NavDropdown.Divider />

                    <NavDropdown.Item>
                      <Button variant="None" onClick={handleLogout} className={`nav-link ${pageAspect.text}`}>Mi Perfil</Button>
                    </NavDropdown.Item>

                    
                    <NavDropdown.Divider />

                    <NavDropdown.Item>
                      <div>
                        <p>Aspecto:
                          {darkMode ? (
                            <Button variant={pageAspect.lightBtn} className="ms-2">Oscuro</Button>
                          ) : (
                            <Button variant={pageAspect.darkBtn} className="ms-2">Claro</Button>
                          )}
                        </p>


                      </div>
                    </NavDropdown.Item>
                    <NavDropdown.Item>Idioma: {/*Aquí el selector de idioma */}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Button variant="danger" onClick={handleLogout} className="col-12" >LogOut</Button>
                    </NavDropdown.Item>
                  </NavDropdown>





                </>
              ) : (
                <>
                  <Button variant={pageAspect.general} className="me-3" onClick={() => loginModal.setShowModal(true)}>Login</Button>
                  <Button variant={pageAspect.general} className="btn-outline-success me-3" onClick={() => registerModal.setShowModal(true)}>Register</Button>
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
            validators={registerValidators}
            onHide={() => registerModal.setShowModal(false)}
            onSuccess={handleRegister}
          />
        </>
      )}

    </>
  );
};

export default MainNavbar;
