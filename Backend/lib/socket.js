import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express;
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: ["http://localhost:4000I"] }
});

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnected", () => {
        console.log("A user disconnected!", socket.id);
    });
});

export { io, app, server };