import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RoomContext } from '../../contexts';
import { toast } from 'react-toastify';

const backend_url = import.meta.env.VITE_API_URL;

const ConfirmDeleteModal = ({ data }) => {
  const { sureText, destroyUrl, show, onClose } = data;
  const { fetchOwnPlayer } = useContext(RoomContext);

  const navigate = useNavigate();

  const fetchDestroy = async (url) => {
    try {
      const response = await fetch(
        `${backend_url}${url}`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json' // Agrega el encabezado 'Content-Type'
          },
          body: JSON.stringify({}) // Agrega un cuerpo vacío
        }
      );
      const responseData = await response;

      if (responseData.status == 204) {
        if (data.navigate != null) {
          toast.success("Sala eliminada correctamente");
          navigate(data.navigate);
        } else {
          onClose();
          fetchOwnPlayer()

        }
      }
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{sureText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => fetchDestroy(destroyUrl)}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;