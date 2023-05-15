import React, { useState } from 'react';

const DirectoryList = ({ directories, handleDirectoryClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ul>
      {directories.map(directory => (
        <li key={directory.id}>
          <div onClick={() => handleDirectoryClick(directory)}>
            {directory.name}
          </div>
          {directory.subdirectories && directory.subdirectories.length > 0 && (
            <div>
              <button onClick={toggleIsOpen}>
                {isOpen ? '-' : '+'}
              </button>
              {isOpen && (
                <DirectoryList
                  directories={directory.subdirectories}
                  handleDirectoryClick={handleDirectoryClick}
                />
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default DirectoryList;
