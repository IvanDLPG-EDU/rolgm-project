import React from "react";
import { DarkModeSlider } from "../../commons";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <button className="btn btn-primary mt-3 mb-3 m-2" onClick={()=>navigate(`/`)}>Home</button>
      <DarkModeSlider />


    </>
  );
};

export default Settings;