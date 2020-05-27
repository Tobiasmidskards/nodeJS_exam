let socket = undefined;

$('#s-header').on('click', () => {
    $('.support-body').toggle('collapsed');
    if (!socket) {
        startChat();
    }
})

function startChat() {
    socket = io.connect()
    socket.emit("MESSAGE", { role: 'USER' });

    $('#messages').prepend(`<div id="message">Waiting for support..</div>`);

    socket.on("MESSAGE", data => {
        switch(data) {
            case 'ADMINCONNECTED':
                $('#messages').prepend(`<div id="message">Support is connected!</div>`);
                break;
            case 'ADMINDISCONNECTED':
                $('#messages').prepend(`<div id="message">Support has disconnected..</div>`);
                break;
            default: 
                $('#messages').prepend(`<div id="message"><b>Support</b>: ${data}</div>`)
                break;
        }
    })
}

function validate(event) {
    event.preventDefault();
    let message = $('#input').val();
    if (message !== '') {
        $('#messages').prepend(`<div id="message"><b>You</b>: ${message}</div>`)
        $('#input').val('')
        socket.emit("MESSAGE", { message });
    }
}