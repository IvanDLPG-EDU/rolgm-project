import React, { useState, useContext } from "react";
import { DarkModeSlider, ConfirmDeleteModal } from "../../commons";
import { useNavigate, useParams } from 'react-router-dom';
import { RoomContext, UserContext } from "../../../contexts";


const Settings = () => {
  const { user } = useContext(UserContext);
  const { roomData } = useContext(RoomContext);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [modalData, setModalData] = useState({
    destroyUrl: `/api/room/${roomId}/delete/`,
    sureText: "Estás seguro de que deseas eliminar la sala?",
    show: false,
    navigate: '/',
    onClose: () => setModalData(prevData => ({ ...prevData, show: false })),
  })

  const detail = `/sala/${roomId}/detail`
  return (
    <>
      {/* <button className="btn btn-primary mt-3 mb-3 m-2" onClick={() => navigate(`/`)}>Home</button>
      <button className="btn btn-primary mt-3 mb-3 m-2" onClick={() => navigate(`/sala/${roomId}/detail`)}>Detail</button>
       */}

      <button className="btn btn-primary mt-3 mb-3 m-2"><a href="/">Home</a></button>
      <button className="btn btn-primary mt-3 mb-3 m-2"><a href={detail}>Detail</a></button>
      
      
      {user.id == roomData.roomOwner && <button className="btn btn-danger mt-3 mb-3 m-2" onClick={() => setModalData(prevData => ({ ...prevData, show: true }))}>Borrar Sala</button>
      }
      <DarkModeSlider />

      <ConfirmDeleteModal data={modalData} />

    </>
  );
};

export default Settings;