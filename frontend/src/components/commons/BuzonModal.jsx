import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Modal, Tab, Nav, Form, Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { UserContext } from '../../contexts';

const backend_url = import.meta.env.VITE_API_URL;
const url = '/api/own-tickets/';

const BuzonModal = ({ showModal, onHide }) => {

    const [data, setData] = useState([]);
    const { darkMode } = useContext(UserContext);
    const [filteredData, setFilteredData] = useState([]);
    const [activeTab, setActiveTab] = useState('invitations');
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;

    const fetchData = async () => {
        try {
            const response = await fetch(`${backend_url}${url}`, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const jsonData = await response.json();
            setData(jsonData);
            setFilteredData(jsonData.filter((item) => item.type === 'i')); // Filtrar por tipo de invitación ('i')
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'invitations') {
            setFilteredData(data.filter((item) => item.type === 'i')); // Filtrar por tipo de invitación ('i')
        } else if (tab === 'requests') {
            setFilteredData(data.filter((item) => item.type === 'r')); // Filtrar por tipo de petición ('r')
        }
        setCurrentPage(0); // Reiniciar la página actual al cambiar de pestaña
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFilteredData(data.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())));
        
      };

      const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
      };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredData.slice(offset, offset + itemsPerPage);

    return (
        <Modal className={darkMode ? 'dark-modal' : 'light-modal'} show={showModal} onHide={() => onHide()}>
            <Modal.Header closeButton>
                <Modal.Title>Formulario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
                    <Nav variant="tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="invitations">Invitaciones</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="requests">Peticiones</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="invitations">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="search">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar por nombre de sala"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Group>
                            </Form>
                            {currentItems.map((item) => (
                                <Card key={item.id}>
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>{item.message}</Card.Text>
                                        <Card.Text>
                                            Origen: {item.origin_user}, Destino: {item.dest_user}, Sala: {item.Room}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                            <ReactPaginate
                                previousLabel={'Anterior'}
                                nextLabel={'Siguiente'}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange}
                                containerClassName={'pagination justify-content-center'}
                                pageClassName={'page-item'}
                                breakClassName={'page-item'}
                                previousClassName={'page-item'}
                                nextClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                breakLinkClassName={'page-link'}
                                previousLinkClassName={'page-link'}
                                nextLinkClassName={'page-link'}
                                activeClassName={'active'}
                            />

                        </Tab.Pane>
                        <Tab.Pane eventKey="requests">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="search">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar por nombre de sala"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Group>
                            </Form>
                            {currentItems.map((item) => (
                                <Card key={item.id}>
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Text>{item.message}</Card.Text>
                                        <Card.Text>
                                            Origen: {item.origin_user}, Destino: {item.dest_user}, Sala: {item.Room}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                            <ReactPaginate
                                previousLabel={'Anterior'}
                                nextLabel={'Siguiente'}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange}
                                containerClassName={'pagination justify-content-center'}
                                pageClassName={'page-item'}
                                breakClassName={'page-item'}
                                previousClassName={'page-item'}
                                nextClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                breakLinkClassName={'page-link'}
                                previousLinkClassName={'page-link'}
                                nextLinkClassName={'page-link'}
                                activeClassName={'active'}
                            />

                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Modal.Body>
        </Modal>
    );
};

export default BuzonModal;