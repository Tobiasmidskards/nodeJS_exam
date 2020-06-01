let socket;

function startChat() {
    socket = io.connect()
    socket.emit("MESSAGE", { role: 'ADMIN' });

    $('#messages').prepend(`<div id="message">Waiting for client..</div>`);

    socket.on("MESSAGE", data => {
        switch(data) {
            case 'USERCONNECTED':
                $('#messages').prepend(`<div id="message">Client is connected!</div>`);
                break;
            case 'USERDISCONNECTED':
                $('#messages').prepend(`<div id="message">Client has disconnected..</div>`);
                break;
            default: 
                $('#messages').prepend(`<div id="message"><b>Client</b>: ${data}</div>`)
                break;
        }
    })
}

startChat();

function validate(event) {
    event.preventDefault();
    let message = $('#input').val();
    if (message !== '') {
        $('#messages').prepend(`<div id="message"><b>You</b>: ${message}</div>`)
        $('#input').val('')
        socket.emit("MESSAGE", { message });
    }
}