import React, { useState, useCallback } from "react";

const MessageForm = ({ selectedName, setSelectedName, nameList, client }) => {
    const [message, setMessage] = useState("");

    const sendMessage = useCallback(() => {
        if (!message || /^\s*$/.test(message)) {
            return;
        }

        const data = {
            message: message.trim(),
            written_as: selectedName,
        };
        client.send(JSON.stringify({ data }));
        setMessage("");
    }, [message, selectedName, client]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            sendMessage(message, selectedName);
            setMessage("");
        },
        [sendMessage, message, selectedName]
    );

    return (
            <form className="row py-2 bg-light" style={{ position: "absolute", bottom: "0"}} onSubmit={handleSubmit}>
                <div className="col-12 mb-3 mb-0">
                    <input
                        className="form-control"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="col-6">
                    <select
                        className="form-select"
                        value={selectedName || ""}
                        onChange={(e) => setSelectedName(e.target.value)}
                    >
                        {nameList.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-6">
                    <button className="btn btn-primary w-100">Send</button>
                </div>
            </form>
    );
};

export default MessageForm;