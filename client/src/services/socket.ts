import { io } from "socket.io-client";
import { Socket } from "../react-app-env";

export const socket = io(`${process.env.REACT_APP_SERVER_PROXY}`, { transports: ["websocket", "polling"] }) as Socket;
