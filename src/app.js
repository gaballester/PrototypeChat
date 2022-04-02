import express from 'express';
import {Server} from 'socket.io'
import __dirname from './util.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname+'/public'));

const server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

const io = new Server(server)
const log = []
io.on('connection', (socket) => {   
    socket.on('message', (data) => {
        log.push(data)
        // io not socket because we are sending to all clients
        io.emit('log', log)
    })
})
