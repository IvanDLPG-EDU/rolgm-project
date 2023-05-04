import { useState, useEffect } from "react";

const useWebSocket = (activeRoom, setMessages) => {
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (activeRoom) {
            const newClient = new WebSocket(
                `ws://172.18.0.2:8000/ws/room/${activeRoom.id}/`
            );

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

    return { client };
};

export default useWebSocket;
