const socket = io.connect('http://localhost:3500');
const username = prompt('Please tell me your name');

$('form').submit((e) => {
    e.preventDefault();
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');
    return false;
});

// append the chat text message
socket.on('chat_message', (msg) => {
    console.log(`en el chat.js msg: ${msg}`);    
    $('#messages').append($('<li>').html(msg));        
});

// append text if someone is online
socket.on('is_online', (username) => {
    if (username) {
        console.log(`en el chat.js username: ${username}`);
        $('#messages').append($('<li>').html(username));       
    }    
});

socket.emit('username', username);

const isTyping = () => {
    //document.getElementsByName('inputText')[0].placeholder = `${username} is typing`;
};