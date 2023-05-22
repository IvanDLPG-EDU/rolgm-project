import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { RoomProvider, UserProvider } from "./contexts";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <UserProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
    </UserProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
