const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3500;

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => { 
    res.render('index.ejs');
});

io.sockets.on('connection', (socket) => {
            
    socket.on('username', (username) => {        
        if (username) {            
            socket.username = username;
            io.emit('is_online', `<i> ${socket.username} join the chat</i>`);        	
        }        
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('is_online', `<i>${socket.username} left the chat</i>`)        	
        }        
    });

    socket.on('chat_message', (message) => {
        if (message) {                        
            io.emit('chat_message', `<strong>${socket.username}</strong>: ${message}`);
        }
    });
});

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


