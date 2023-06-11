import React, { useState, useContext, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown, Image } from "react-bootstrap";
import { UserContext } from '../../contexts';
import { BuzonModal, useFormModal } from "../commons";

const backend_url = import.meta.env.VITE_API_URL;

const createRoomFormMetadata = {
  title: "Crear Sala",
  cancelBtn: "Cancelar",
  submitBtn: "Crear",
  fetchMetadata: {
    url: backend_url + "/api/rooms/create/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  }
}


const createRoomFields = [
  { name: 'name', label: 'Nombre', type: 'text', info: "( a-z A-Z 0-9 _ . - )", required: true },
  { name: 'description', label: 'Descripcion', type: 'text' },
  { name: 'max_players', label: 'Capacidad de Jugadores', type: 'number', info: "( -1 = No Max )" },
  { name: 'is_private', label: 'Privado', type: 'checkbox' },
  { name: 'password', label: 'Contraseña', type: 'password', depends_on: 'is_private' },
];

const createRoomValidators = {
  'onChange': {
    'name': (name) => { return name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_.ñÑ-]/g, "") },
  },
  'onBlur': {
    'max_players': (max_players) => max_players && !isNaN(max_players) ? max_players == 0 || max_players < -1 ? -1 : max_players : -1
  }
};


const loginFormMetadata = {
  title: "Login",
  cancelBtn: "Cancelar",
  submitBtn: "Entrar",
  fetchMetadata: {
    url: backend_url + "/auth/login/",
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
    url: backend_url + "/auth/register/",
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
    'menuItem': 'text-light',
    'general': 'dark',
    'lightBtn': 'outline-light',
    'darkBtn': 'light',
    'outlineBtn': 'outline-light',
    'nav': 'navbar-dark',
  },
  'light': {
    'bg': 'bg-light',
    'text': 'text-dark',
    'menuItem': 'text-dark',
    'general': 'light',
    'lightBtn': 'dark',
    'darkBtn': 'outline-dark',
    'outlineBtn': 'outline-dark',
    'nav': 'navbar-light',
  }
}

const MainNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token, handleLogout, handleLogin, handleRegister, darkMode, setDarkMode, user } = useContext(UserContext);
  const [hasMessagesInvitation, setHasMessagesInvitation] = useState(false);
  const [hasMessagesRequest, setHasMessagesRequest] = useState(false);
  const [buzonShowModal, setBuzonShowModal] = useState(false);
  const hasMessages = hasMessagesInvitation || hasMessagesRequest;

  useEffect(() => {
    if (!hasMessages) {
      setHasMessagesInvitation(false);
      setHasMessagesRequest(false);
    }
  }, [hasMessages]);

  const renderUserImage = (user) => {
    if (user == null) {
      return (
        <Image
          src=""
          alt="Error"
          roundedCircle
          style={{ width: '27px', height: '27px', marginLeft: '10px' }}
        />
      );
    }

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Image
          src={backend_url + user.profile_picture}
          alt="User profile image"
          roundedCircle
          style={{ width: '27px', height: '27px', marginLeft: '10px' }}
        />
        {hasMessages && (
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'red',
              border: '1px solid white',
            }}
          />
        )}
      </div>
    );
  };

  const [userImage, setUserImage] = useState(token ? renderUserImage(user) : '');

  useEffect(() => {
    if (user && user.profile_picture) {
      setUserImage(renderUserImage(user));
    }
  }, [user, hasMessages]);

  const [createdRoom, setCreatedRoom] = useState(null);

  useEffect(() => {
    if (createdRoom) {
      window.location.href = '/sala/' + createdRoom.id;
    }
  }, [createdRoom]);

  const location = useLocation();
  const inHome = location.pathname === '/';

  const handleNavbarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const loginModal = useFormModal();
  const registerModal = useFormModal();
  const createRoomModal = useFormModal();

  const pageAspect = darkMode ? aspects['dark'] : aspects['light'];

  return (
    <>
      <Navbar variant={pageAspect.general} className={`custom-navbar ${inHome ? 'transparent' : pageAspect.bg}`} expand="lg" fixed="top" expanded={isExpanded}>
        <Container>
          <NavLink to="/" className={`navbar-brand ${inHome ? 'text-light' : pageAspect.text}`}>RolGM</NavLink>
          <Navbar.Toggle onClick={handleNavbarToggle} className={pageAspect.nav} />
          <Navbar.Collapse className={isExpanded ? 'justify-content-end' : ''}>
            <Nav className="me-auto">
            </Nav>
            <Nav>
              {token && token !== 'null' ? (
                <>
                  <Nav.Link href="/noticias" className={`nav-link me-3 ${inHome ? 'text-light' : pageAspect.text}`}>Noticias</Nav.Link>
                  <Nav.Link href="/foro" className={`nav-link me-3 ${inHome ? 'text-light' : pageAspect.text}`}>Foro</Nav.Link>
                  <NavDropdown title="Juegos" id="basic-nav-dropdown" menuVariant={pageAspect.general} className={`custom-dropdown ${inHome ? 'text-light' : pageAspect.text}`}>
                    <NavDropdown.Item href="/mis-partidas">Mis Partidas</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => createRoomModal.setShowModal(true)}>
                      Crear Sala
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/salas">Unirme a Partida</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title={userImage} id="basic-nav-dropdown" autoClose="outside" menuVariant={pageAspect.general} className={`custom-dropdown ${inHome ? 'text-light' : pageAspect.text}`}>
                    <NavDropdown.Item>
                      <div className="user-info">
                        <p className="public-name">{user.public_name}</p>
                        <p className="username">@{user.username}</p>
                      </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <div className="toggle-buttons-container" style={{ display: 'flex' }}>
                        {hasMessagesInvitation ? (
                          <div
                            style={{
                              position: 'relative',
                              top: '0',
                              left: '10px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'red',
                              border: '1px solid white',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              position: 'relative',
                              top: '0',
                              left: '10px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'transparent',
                              border: '1px solid transparent',
                            }}
                          />
                        )}
                        <Button
                          variant={pageAspect.outlineBtn}
                          onClick={() => {setHasMessagesInvitation(!hasMessagesInvitation); setBuzonShowModal(true)}}
                          style={{ marginRight: '5px' }}
                        >
                          I
                        </Button>
                        {hasMessagesRequest ? (
                          <div
                            style={{
                              position: 'relative',
                              top: '0',
                              left: '10px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'red',
                              border: '1px solid white',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              position: 'relative',
                              top: '0',
                              left: '10px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'transparent',
                              border: '1px solid transparent',
                            }}
                          />
                        )}
                        <Button
                          variant={pageAspect.outlineBtn}
                          onClick={() => {setHasMessagesRequest(!hasMessagesRequest); setBuzonShowModal(true)}}
                        >
                          R
                        </Button>
                      </div>

                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <div>
                        <NavLink to="/mi-perfil" className={pageAspect.menuItem}>Mi Perfil</NavLink>
                      </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <div className="toggle-buttons-container d-flex align-items-center">
                        <p className="me-2">Aspecto:</p>
                        <Button
                          variant={darkMode ? pageAspect.lightBtn : pageAspect.darkBtn}
                          onClick={() => setDarkMode(!darkMode)}
                        >
                          {darkMode ? 'Oscuro' : 'Claro'}
                        </Button>
                      </div>

                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="mr-2">Idioma:</span>
                        <Button variant="" disabled>ES</Button>
                      </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Button variant="danger" onClick={handleLogout} className="col-12">LogOut</Button>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Button variant="null" className={`nav-link me-3 ${inHome ? 'text-light' : pageAspect.text}`} onClick={() => loginModal.setShowModal(true)}>
                    <span>Login</span>
                  </Button>
                  <Button variant="dark" className={`nav-link me-3 ${inHome ? 'text-light' : pageAspect.text}`} onClick={() => registerModal.setShowModal(true)}>
                    <span>Register</span>
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {token && token !== 'null' ? null : (
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
      {createRoomModal.showModal && (
        <createRoomModal.FormModal
          formMetadata={createRoomFormMetadata}
          fields={createRoomFields}
          validators={createRoomValidators}
          onHide={() => createRoomModal.setShowModal(false)}
          onSuccess={(data) => setCreatedRoom(data)}
        />
      )}
      <BuzonModal showModal={buzonShowModal} onHide={() => setBuzonShowModal(false)} />
    </>
  );
};

export default MainNavbar;