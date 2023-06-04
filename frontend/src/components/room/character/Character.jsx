import React, { useContext, useState, useEffect } from "react";
import { RoomContext } from "../../../contexts";
import { ListGroup, Button, Container } from "react-bootstrap";
import { ConfirmDeleteModal, useFormModal } from "../../commons";
import ReactPaginate from "react-paginate";

const backend_url = import.meta.env.VITE_API_URL;

const formMetadata = {
  title: "Crear Personaje",
  cancelBtn: "Cancelar",
  submitBtn: "Enviar",
  fetchMetadata: {
    url: backend_url + "/api/character/create/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  }
}

const Character = () => {
  const { sendToServer, roomData } = useContext(RoomContext);
  const { client, ownPlayer } = roomData;
  const { setShowModal, FormModal } = useFormModal();
  const [currentPage, setCurrentPage] = useState(0);
  const charactersPerPage = 5; // Número de personajes por página


  const [destroyModalData, setDestroyModalData] = useState({
    destroyUrl: `/api/character/id/delete/`,
    sureText: "Estás seguro de que deseas eliminar el personaje?",
    show: false,
    navigate: null,
    onClose: () => setDestroyModalData(prevData => ({ ...prevData, show: false })),
  })

  const fields = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'player_id', label: 'Player ID', type: 'number', disabled: true, default: ownPlayer.id },
  ];

  const createCharacter = (rawData) => {
    const data = {
      type: 'add_character',
      payload: {
        ...rawData,
      }
    };
    sendToServer({ client, data });
  }

  const handleCharacterClick = (character) => {

    setDestroyModalData(prevData => ({
      ...prevData,
      destroyUrl: `/api/character/${character.id}/delete/`,
      sureText: `Estás seguro de que deseas eliminar el personaje ${character.name}?`,
    }));

  };

  useEffect(() => {
    if (destroyModalData && destroyModalData.show == false && destroyModalData.destroyUrl && destroyModalData.destroyUrl != '/api/character/id/delete/') {
      setDestroyModalData(prevData => ({ ...prevData, show: true }))
    }
  }, [destroyModalData.destroyUrl]);


  // Lógica para obtener los personajes de la página actual
  const offset = currentPage * charactersPerPage;
  const currentCharacters = ownPlayer.characters.slice(offset, offset + charactersPerPage);

  const pageCount = Math.ceil(ownPlayer.characters.length / charactersPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <>
      <Container>
        <h1 className="my-4">Listado de personajes</h1>
        <Button variant="primary" className="mb-4" onClick={() => setShowModal(true)}>Crear personaje</Button>

        {/* Paginación */}
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination justify-content-center"}
          subContainerClassName={"pagination"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          breakClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />

        {currentCharacters.length ? (
          <ListGroup>
            {currentCharacters.map((character) => (
              <ListGroup.Item key={character.id} className="d-flex justify-content-between align-items-center">
                <span>{character.name}</span>
                <Button
                  variant="danger"
                  className="ml-2"
                  onClick={() => handleCharacterClick(character)}
                >
                  x
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="mt-4">Parece que aún no hay personajes.</p>
        )}

      </Container>

      <FormModal
        formMetadata={formMetadata}
        fields={fields}
        onHide={() => setShowModal(false)}
        onSuccess={createCharacter}
      />

      <ConfirmDeleteModal data={destroyModalData} />

    </>
  );
};

export default Character;