// src/components/ProtectedRoute.tsx
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { authAtom } from "../../atoms/authAtom";
import { useCookies } from "react-cookie";
import { Websocket_URL } from "../../Globle";

interface ProtectedRouteProps {
  element: JSX.Element;
}

export let socket: WebSocket | null = null;

function connectSocket(token: string) {
  // Ensure that socket isn't already connected
  console.log("Current socket:", socket);

  if (!socket || socket.readyState === WebSocket.CLOSED) {
    console.log("Connecting to WebSocket...");

    // Create a new WebSocket connection
    socket = new WebSocket(`${Websocket_URL}?token=${token}`);

    // WebSocket event handlers
    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      socket = null; // Reset the socket when closed
    };
  }
}

function disconnectSocket() {

  console.log("Disconnecting WebSocket...");
  socket?.close(); // Close the WebSocket connection
  socket = null;

}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const auth = useRecoilValue(authAtom);
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      connectSocket(cookies.token);
    } else {
      disconnectSocket();
    }

    // Cleanup the WebSocket when the component unmounts
    return () => {
      disconnectSocket();
    };
  }, [auth.isAuthenticated]);

  return auth.isAuthenticated ? element : <Navigate to="/import-export/signin" />;
};

export default ProtectedRoute;
