import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';


export const DetailedRoomPage = () => {
    const { roomId } = useParams();

    // Assuming you have the room data available, you can replace `roomData` with the actual data object
    const roomData = {
        id: roomId,
        owner: 'John Doe',
        name: 'Sample Room',
        description: 'This is a sample room',
        image: 'https://via.placeholder.com/400x300',
        max_players: 10,
        room_id: 'ABC123',
        created_at: '2023-05-20',
        is_private: true,
        player_count: 5,
        spectator_count: 2,
    };

    return (
        <Container className="detailed-room-page mt-5">
            <h1 className="pt-3">{roomData.name}</h1>
            <Row>
                <Col xs={12} md={6}>
                    <Image src={roomData.image} alt="Room" fluid />
                </Col>
                <Col xs={12} md={6}>
                    <div className="owner mb-2">Owner: {roomData.owner}</div>
                    <div className="description mb-2">Description: {roomData.description}</div>
                    <div className="max-players mb-2">Max Players: {roomData.max_players}</div>
                    <div className="room-id mb-2">Room ID: {roomData.room_id}</div>
                    <div className="created-at mb-2">Created At: {roomData.created_at}</div>
                    <div className="is-private mb-2">Is Private: {roomData.is_private ? 'Yes' : 'No'}</div>
                    <div className="player-count mb-2">Player Count: {roomData.player_count}</div>
                    <div className="spectator-count mb-2">Spectator Count: {roomData.spectator_count}</div>
                    <Button href={`/sala/${roomId}/`} variant="primary">
                        Ver Sala
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
