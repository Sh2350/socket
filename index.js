const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});



io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on('join', (room) =>{
        socket.join(room)
        console.log(`User joined Room Name : ` + room)
    })

    socket.on('typing', (onTyping,room) =>{
        console.log(`on typing ` + onTyping.username)
        const typingData = {
            username : onTyping.username,
        }
        socket.broadcast.to(room).emit('typing',(typingData))
    })

    socket.on('check', (room, position, id) =>{
        console.log(`check id` + id + " position and room " + position + " " + room)
        const checkingData = {
            id : id,
        }
        socket.broadcast.to(room).emit('check1',(checkingData))
    })

    socket.on('update', (idsRoom) =>{
        console.log(`update ` + idsRoom)
        const updateData = {
            idsRoom : idsRoom,
        }
        socket.broadcast.emit('update1',(updateData))
    })

    socket.on('messagedetection', (yourselfName, txt, room, yourselfPhoto, time, pp, types) => {
        const chatData = {
            senderNickname : yourselfName,
            message : txt,
            room : room,
            types : types,
            photo : yourselfPhoto,
            time : time,
            id : pp
        }
        socket.broadcast.to(room).emit('message',(chatData))
    })
});



server.listen(3000, () => {
    console.log('listening on *:3000');
});