import React, { useContext } from "react";
import { RoomContext } from "../../../contexts";
import { ListGroup, Button, Container } from "react-bootstrap";

export const Template = () => {

    const { templateList } = useContext(RoomContext);

    return (
        <Container>
            <h1 className="my-4">Listado de Plantillas</h1>
            <Button variant="primary" className="mb-4">Crear Plantilla</Button>
            {templateList.length ? (
                <ListGroup>
                    {templateList.map((template) => (
                        <ListGroup.Item key={template.id}>{template.name}</ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="mt-4">Parece que aún no hay plantillas.</p>
            )}
        </Container>
    );

}


