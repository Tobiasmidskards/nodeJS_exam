let newTickets = $('#new-tickets');
let button = $('#resolve-ticket-button');

let ticketWrapper = $('#ticket-wrapper');
let ticketWrapperTwo = $('#ticket-wrapper-two');

ticketWrapper.hide();

button.on('click', () => {
    window.open("/adminticket", "Support ticket", "width=250,height=350");
})

let interval = setInterval(() => {
    $.ajax('/support/users')
    .done((response) => {
        let number = response.numberOfClients;

        if (number > 0) {
            newTickets.text('You have ' + response.numberOfClients + ' in queue')
            newTickets.show();
            ticketWrapper.show();
            ticketWrapperTwo.hide();
        } else {
            ticketWrapper.hide();
            ticketWrapperTwo.show();
        }
})
}, 2000)
