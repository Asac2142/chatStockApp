const socket = io.connect(`http://localhost:3500`);
let username;

Swal.fire({    
    title: 'Welcome to stockBot 9000',
    text: 'What is your name?',
    input: 'text',
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Enter',
    inputPlaceholder: 'Enter your name',
    showLoaderOnConfirm: false,
    preConfirm: (login) => {
        username = login;
        init();
    }
});

const init = () => {
    socket.emit('username', username);
};

$('form').submit((e) => {
    e.preventDefault();
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');
    return false;
});

// append the chat text message
socket.on('chat_message', (msg) => {    
    if(!msg.includes('undefined')) {        
        $('#messages').append($('<li>').html(msg));  
    }    
});

// append text if someone is online
socket.on('is_online', (username) => {
    if (username) {        
        $('#messages').append($('<li>').html(username));       
    }    
});

const isTyping = () => {
    
};