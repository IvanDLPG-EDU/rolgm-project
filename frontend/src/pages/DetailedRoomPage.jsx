import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { UserContext } from '../contexts';

const backend_url = import.meta.env.VITE_API_URL;

const fetchJoinRoom = async (roomId) => {
    const response = await fetch(`${backend_url}/api/room/${roomId}/join/`,
        {
            method: 'POST',
            headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
    const data = await response.json();

    return data
}

export const DetailedRoomPage = () => {
    const { darkMode } = useContext(UserContext);
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [roomData, setRoomData] = useState({
        id: roomId,
        owner: 'No Owner',
        name: 'No Name',
        description: 'No Description',
        image: 'https://via.placeholder.com/400x300',
        max_players: -1,
        room_id: 'No Room ID',
        created_at: 'No Date',
        is_private: false,
        player_count: 0,
        spectator_count: 0,
    })


    const fetchRoomData = async (roomId, setRoomData) => {
        const response = await fetch(`${backend_url}/api/room/${roomId}`,
            { headers: { Authorization: `Token ${localStorage.getItem('token')}` } });
        const data = await response.json();

        if (data.detail) {
            navigate('/');
            return;
        }

        setRoomData(data)
    };


    const joinRoom = (roomId) => {

        fetchJoinRoom(roomId)
            .then((data) => {
                if (data['errors']) {
                    if (data['errors']['user']) {
                        navigate(`/sala/${roomId}/`)
                    } else {
                        console.log(data['errors'])
                    }

                }
            })
    }

    useEffect(() => {
        if (roomId) {
            fetchRoomData(roomId, setRoomData);
        }
    }, []);

    const joinRoomButton = () => {
        if (roomData.is_private) {
            return (
                // <Button href={`/sala/${roomId}/`} className="mt-4" variant="primary">
                //     Pedir Invitación
                // </Button>
                <Button onClick={() => joinRoom(roomId)} className="mt-4" variant="primary">
                    Pedir Invitación
                </Button>
            );
        }
        return (
            // <Button href={`/sala/${roomId}/`} className="mt-4" variant="primary">
            //     Unirse a la sala
            // </Button>
            <Button onClick={() => joinRoom(roomId)} className="mt-4" variant="primary">
                Unirse a la sala
            </Button>
        );
    }

    return (
        <Container
            fluid
            className={`detailed-room-page bg-custom-${darkMode ? "dark" : "light"}`}
            style={{ height: "100vh", padding: "0 30px" }}
        >
            <h1 className="pt-3">{roomData.name} #{roomData.room_id}</h1>
            <Row style={{ paddingTop: "80px" }}>
                <Col xs={12} md={6}>
                    <Image src={roomData.image || "https://via.placeholder.com/400x300"} alt="Room" fluid />
                </Col>
                <Col xs={12} md={6}>
                    <div className="owner mb-2">Owner: {roomData.owner}</div>
                    <div className="description mb-2">Description: {roomData.description}</div>
                    <div className="max-players mb-2">Max Players: {roomData.max_players}</div>
                    <div className="created-at mb-2">Created At: {roomData.created_at}</div>
                    <div className="is-private mb-2">Is Private: {roomData.is_private ? 'Yes' : 'No'}</div>
                    <div className="player-count mb-2">Player Count: {roomData.player_count}</div>
                    <div className="spectator-count mb-2">Spectator Count: {roomData.spectator_count}</div>

                    {joinRoomButton()}

                </Col>
            </Row>
        </Container>
    );
};
