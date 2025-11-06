import { io } from "socket.io-client";

const SOCKITIO_URL = "http://localhost:3000";
export const socket = io(SOCKITIO_URL,{
    autoConnect: false
});