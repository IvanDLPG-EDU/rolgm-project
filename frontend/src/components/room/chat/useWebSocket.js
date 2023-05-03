import { useState, useEffect } from "react";

const useWebSocket = (activeRoom) => {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (activeRoom) {
            const newClient = new WebSocket(
                `ws://172.18.0.2:8000/ws/room/${activeRoom.id}/`
            );

            if (messages.length === 0) {
                setMessages(activeRoom.messages);
            }

            newClient.onmessage = (message) => {
                const messageData = JSON.parse(message.data);
                setMessages((messages) => [...messages, messageData]);
            };

            setClient(newClient);

            return () => {
                newClient.close();
            };
        }
    }, [activeRoom]);

    return { client, messages };
};

export default useWebSocket;