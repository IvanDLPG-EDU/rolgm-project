import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { UserContext } from '../contexts';
const backend_url = import.meta.env.VITE_API_URL;

const MiPerfil = () => {
    const { user, darkMode } = useContext(UserContext);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [editedUser, setEditedUser] = useState({
        bio: user.bio || "",
        public_name: user.public_name || "",
        username: user.username || "",
        email: user.email || "",
        profile_picture: backend_url + user.profile_picture || "",
        // Otros campos del usuario
    });

    useEffect(() => {
        setEditedUser({
            bio: user.bio || "",
            public_name: user.public_name || "",
            username: user.username || "",
            email: user.email || "",
            profile_picture: backend_url + user.profile_picture || "",
            // Otros campos del usuario
        });
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para guardar los cambios del perfil
        console.log(editedUser);
    };

    const handleEditarPerfil = () => {
        setModoEdicion(true);
    };

    const handleCancelarEdicion = () => {
        setModoEdicion(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setEditedUser({ ...editedUser, profile_picture: file });
    };

    return (
        <Container
            fluid
            className={`bg-custom-${darkMode ? "dark" : "light"} my-profile`}
            style={{ padding: "0 30px" }}
        >
            <Row style={{ paddingTop: "80px" }}>
                <Col md={6} className="mt-4">
                    {editedUser.profile_picture && (
                        <div className="text-center">
                            <Image
                                src={editedUser.profile_picture}
                                alt="User profile image"
                                style={{ width: '300px', height: '300px', marginTop: '10px' }}
                            />
                            {modoEdicion && (
                                <Form.Group className="mt-5 custom-input-file">
                       
                                    <Form.Control type="file" onChange={handleImageUpload} />
                                </Form.Group>
                            )}
                        </div>
                    )}
                </Col>
                <Col md={6}>
                    <div className="">
                        <h2 className="pt-4">Mi Perfil</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Public Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly={!modoEdicion}
                                    value={editedUser.public_name}
                                    onChange={(e) => setEditedUser({ ...editedUser, public_name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly={!modoEdicion}
                                    value={editedUser.username}
                                    onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    readOnly={!modoEdicion}
                                    value={editedUser.bio}
                                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    readOnly={true}
                                    disabled={true}
                                    value={editedUser.email}
                                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                />
                            </Form.Group>
                            {/* Otros campos del usuario */}
                            {modoEdicion && (
                                <div>
                                    <Button variant="secondary" onClick={handleCancelarEdicion}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" className="ms-2">
                                        Guardar
                                    </Button>
                                </div>
                            )}
                            {!modoEdicion && (
                                <Button variant="primary" onClick={handleEditarPerfil}>
                                    Editar Perfil
                                </Button>
                            )}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default MiPerfil;
