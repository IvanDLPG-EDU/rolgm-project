import React, {useContext} from "react";
import { RoomContext } from "../../../contexts";
import DirectoryList from "../directories/DirectoryList";

const DirectoryTab = ({data}) => {
    const { roomData } = useContext(RoomContext);

    const handleDirectoryClick = () => {
        console.log("CLICK")
    }

    return (
        <div>
        <h1>Directory List</h1>
        <DirectoryList
            directories={[roomData.directories]}
            handleDirectoryClick={handleDirectoryClick}
        />
        </div>
    );
};

export default DirectoryTab;