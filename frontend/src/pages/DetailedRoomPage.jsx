import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';

const fetchRoomData = async (roomId, setRoomData) => {
    const response = await fetch(`http://172.18.0.2:8000/api/room/${roomId}`,
      { headers: { Authorization: `Token ${localStorage.getItem('token')}` } });
    const data = await response.json();
   
    setRoomData(data)
  };

export const DetailedRoomPage = () => {
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


      useEffect(() => {
        if (roomId) {
            fetchRoomData(roomId, setRoomData);
        }
      }, []);

      const joinRoomButton = () => {
        if (roomData.is_private) {
            return (
                <Button href={`/sala/${roomId}/`} className="mt-4" variant="primary">
                    Pedir Invitación
                </Button>
            );
        }
        return (
            <Button href={`/sala/${roomId}/`} className="mt-4" variant="primary">
                Unirse a la sala
            </Button>
        );
      }

    return (
        <Container className="detailed-room-page mt-5">
            <h1 className="pt-3">{roomData.name} #{roomData.room_id}</h1>
            <Row>
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
