import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoomCreationPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        max_players: 0,
        is_private: false,
        password: '',
    });

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        setFormData({ ...formData, [name]: value });
    };

    const handleMaxPlayersBlur = () => {
        if (!formData.max_players || formData.max_players < 0) {
          setFormData({ ...formData, max_players: 0 });
        }
      };

      const handleMaxPlayersClick = () => {
        if (formData.max_players < 0) {
          setFormData({ ...formData, max_players: 0 });
        }
      };


      useEffect(() => {
        const name = formData.name;
    
        const formattedName = name
          .replace(/ /g, "_")
          .replace(/[^a-z0-9_.ñ-]/gi, "");
    
        setFormData({
          ...formData,
          name: formattedName,
        });
      }, [formData.name]);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch("http://172.18.0.2:8000/api/rooms/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                navigate("/salas");
            })
            .catch((error) => {
                console.error("Error:", error);
                // Realiza alguna acción adicional en caso de error
            });
    };

    return (
        <div className="container mt-5" style={{ paddingTop: "20px" }}>
            <h1>Create A Room</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">*Nombre:</label>
                    <span style={{ color: "gray", fontSize: "0.8em", marginLeft: "5px" }}>
                        ( a-z 0-9 _ . - )
                    </span>
                    <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="max_players">Máximo de jugadores: </label>
                    <span style={{ color: "gray", fontSize: "0.8em", marginLeft: "5px" }}>
                        ( 0 = No Max. ) 
                    </span>
                    <input
                    type="number"
                    name="max_players"
                    className="form-control"
                    value={formData.max_players}
                    onChange={handleInputChange}
                    onBlur={handleMaxPlayersBlur}
                    onClick={handleMaxPlayersClick}
                    />
                </div>
                <div className="form-check">
                    <input
                    type="checkbox"
                    name="is_private"
                    className="form-check-input"
                    checked={formData.is_private}
                    onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_private">
                    Privado
                    </label>
                </div>
                {formData.is_private && (
                    <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    </div>
                )}
                <button type="submit" className="btn btn-primary mt-3">
                    Crear sala
                </button>
            </form>
        </div>
    );
}

export default RoomCreationPage;
