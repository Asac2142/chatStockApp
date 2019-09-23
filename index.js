const API = require('./api/api');
const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      io = require('socket.io')(http),      
      port = 2142;

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
            io.emit('is_online', `<p style="color:#00b159">${socket.username} join the chat</p>`);        	
        }        
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('is_online', `<p style="color:#f37735">${socket.username} left the chat</p>`)        	
        }        
    });

    socket.on('chat_message', (message) => {        
        if (verifyMessage(message)) {                        
            io.emit('chat_message', `<strong>${socket.username}</strong>: ${message}`);
            getStock(getStockCode(message));
        } else {
            io.emit('chat_message', `<strong>stockBot</strong>: <p style="color: red">code entered not valid</p>`);
        }
    });
});

const getStock = async (code) => {
    // const quote = await API.getStockInfo(code.toUpperCase());
    await API.getStockInfo(code).then((res) => {
        console.log(`Res: ${res}`);
        io.emit('chat_message', `<strong>stockBot</strong>: <p style="color:#189ad3 ">${res}</p>`)
    });    
};

const getStockCode = (msg) => {
    return msg.split('=')[1];
};

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