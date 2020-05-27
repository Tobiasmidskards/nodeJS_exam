const escape = require('escape-html');

class Support {

    io;
    socketServer;
    userList;
    adminList;
    paired;

    constructor(app, server) {
        this.userList = [];
        this.adminList = [];
        this.paired = [];
        this.io = require('socket.io')(server);
        this.startListening();
        this.pairClients(5000)
        this.serveApi(app);
        console.log("Socket created");
    }

    // Setup endpoint to get current queue
    serveApi(app) {
        app.get('/support/users', async (req, res) => {
            return res.send({numberOfClients : this.userList.length})
        })
    }

    // Function to pair users with admins.
    pairClients(interval) {

        // Do this every [interval] in milliseconds
        setInterval(() => {
            //this.logClientList();

            // If we can pair a waiting users and a waiting admin
            if(this.userList.length > 0 && this.adminList.length > 0) {
                let userToPair = this.userList.pop()
                let adminToPair = this.adminList.pop();

                let pair = {
                    user : userToPair,
                    admin : adminToPair,
                }

                // let them know they are connected
                userToPair.emit('MESSAGE', 'ADMINCONNECTED')
                adminToPair.emit('MESSAGE', 'USERCONNECTED')
    
                // Append them to the paired list
                this.paired.push(pair);
            }
        }, interval)
    }

    // Listening for socket messages
    startListening() {
        this.io.on('connection', socket => {
            socket.on('disconnect', (reason) => this.disconnected(socket));
            socket.on("MESSAGE", (message) => this.incoming(socket, message));            
        })
    }

    logClientList() {
        console.log("-");
        console.log('-----USER------')
        this.userList.forEach(element => {
            console.log(element.id)
        });
        console.log('-------|-------')
        console.log("-");        
        console.log('-----ADMIN------')
        this.adminList.forEach(element => {
            console.log(element.id)
        });
        console.log('-------|-------')
        console.log("-");        
        console.log('-----PAIR------')
        this.paired.forEach(element => {
            console.log(element.user.id, element.admin.id)
        });
        console.log('-------|-------')
    }

    // When a client is disconnected
    disconnected(socket) {
        let pairIndex = this.getPairIndex(socket);
        let pair = this.paired[pairIndex];

        if (pair) {
            let isUser = pair.user.id === socket.id;

            // Check if wether the user or det admin disconnected from the chat
            if (isUser) {
                this.paired[pairIndex].admin.emit('MESSAGE', 'USERDISCONNECTED');
            } else {
                this.paired[pairIndex].user.emit('MESSAGE', 'ADMINDISCONNECTED');
            }

            // Removed det paired clients from the list
            this.paired.splice(pairIndex, 1);        
        }
    }

    // Handle incoming messages
    incoming(socket, message) {
        
        // Check if whether a user og an admin has logged in the chat
        if (message.role !== undefined) {

            // Assigning the client to the proper queue
            switch(message.role) {
                case 'USER':
                    this.userList.push(socket);
                    break;
                case 'ADMIN':
                    this.adminList.push(socket);
                    break;
            }
        }
        // If its a message incoming
        if (message.message) {

            // Find the pair from the paired list
            let pair = this.getPair(socket);

            // Check if the client is actually paired
            if (pair) {

                // Check if the client is an admin
                let isAdmin = pair.admin.id === socket.id; 

                // Send the message to the opposite client 
                if (isAdmin) {
                    pair.user.emit('MESSAGE', escape(message.message))
                } else {
                    pair.admin.emit('MESSAGE', escape(message.message))
                }
            } else {
                // Not paired, so we inform the client.
                socket.emit('MESSAGE', 'Please be patient. A support will contact you soon.');
            }
            
        }
    }

    getPairIndex(socket) {
        // Trying to find the user and then the admin
        let user = this.paired.findIndex(pair => pair.user.id == socket.id) 
        let admin = this.paired.findIndex(pair => pair.admin.id == socket.id)

        // No found the functions will return -1
        // Therefore we can use max to find the index, which is always > -1

        return Math.max(user, admin);
    }

    getPair(socket) {
        // Used to retrieve the pair object 
        let pair = this.paired[this.getPairIndex(socket)]

        return pair
    }
}

module.exports = Support