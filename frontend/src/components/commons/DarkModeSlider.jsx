import React, { useContext } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { UserContext } from '../../contexts';

const DarkModeSlider = () => {
  const { darkMode, setDarkMode } = useContext(UserContext);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container fluid className={`slide ${darkMode ? 'dark' : ''}`}>
      <Row>
        <Col>
          <Form.Check
              type="switch"
              id="dark-mode-switch"
              label={darkMode ? "Dark Mode" : "Light Mode"}
              checked={darkMode}
              onChange={handleToggleDarkMode}
              className={`custom-switch ${darkMode ? 'text-light' : 'text-dark'}`}
            />
        </Col>
      </Row>
    </Container>
  );
};

export default DarkModeSlider;