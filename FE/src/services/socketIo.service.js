import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config.js";

const SOCKITIO_URL = SOCKET_URL;
export const socket = io(SOCKITIO_URL,{
    autoConnect: false
});