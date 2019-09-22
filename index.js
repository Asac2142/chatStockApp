const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3500;

app.use(express.static(`${__dirname}/public`));
app.get('/', (req, res) => {     
    res.render('index.ejs');
});

app.get('*', (req, res) => {
    res.render('notFound.ejs');
});

io.sockets.on('connection', (socket) => {            
    socket.on('username', (username) => {        
        if (username) {            
            socket.username = username;
            io.emit('is_online', `<i> ${JSON.stringify(socket.username)} join the chat</i>`);        	
        }        
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('is_online', `<i>${socket.username} left the chat</i>`)        	
        }        
    });

    socket.on('chat_message', (message) => {        
        if (verifyMessage(message)) {                        
            io.emit('chat_message', `<strong>${socket.username}</strong>: ${message}`);
        } else {
            io.emit('chat_message', `<strong>stockBot</strong>: <p style="color: red">code entered not valid<p>`);
        }
    });
});

const verifyMessage = (msg) => {
    msg = msg.trim();
    if (msg.includes('/stock=')) {
        if (msg.split('=').length === 2 && msg.split('=')[1]) {
            return true;
        }
    }
};

http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


