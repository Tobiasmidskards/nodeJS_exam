const escape = require('escape-html');

class Support {
    constructor(app) {
        this.userList = [];
        this.adminList = [];
        this.paired = [];
        this.socketServer = require('http').createServer(app);
        this.io = require('socket.io')(this.socketServer);
        this.startListening();
        this.pairClients(5000)
        this.serveApi(app);
    }

    serveApi(app) {
        app.get('/support/users', async (req, res) => {
            return res.send({numberOfClients : this.userList.length})
        })
    }

    pairClients(interval) {
        setInterval(() => {
            //this.logClientList();

            if(this.userList.length > 0 && this.adminList.length > 0) {
                let userToPair = this.userList.pop()
                let adminToPair = this.adminList.pop();

                let pair = {
                    user : userToPair,
                    admin : adminToPair,
                }

                userToPair.emit('MESSAGE', 'ADMINCONNECTED')
                adminToPair.emit('MESSAGE', 'USERCONNECTED')
    
                this.paired.push(pair);
            }
        }, interval)
    }

    startListening() {
        this.socketServer.listen(4000)

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

    disconnected(socket) {
        let pairIndex = this.getPairIndex(socket);
        let pair = this.paired[pairIndex];

        if (pair) {
            let isUser = pair.user.id === socket.id;
            if (isUser) {
                this.paired[pairIndex].admin.emit('MESSAGE', 'USERDISCONNECTED');
            } else {
                this.paired[pairIndex].user.emit('MESSAGE', 'ADMINDISCONNECTED');
            }

            this.paired.splice(pairIndex, 1);        
        }
    }

    incoming(socket, message) {
        console.log(message);
        if (message.role !== undefined) {
            switch(message.role) {
                case 'USER':
                    this.userList.push(socket);
                    break;
                case 'ADMIN':
                    this.adminList.push(socket);
                    break;
            }
        }
        if (message.message && this.paired.length > 0) {
            let pair = this.getPair(socket);

            if (pair) {
                let isAdmin = pair.admin.id == socket.id; 

                if (isAdmin) {
                    pair.user.emit('MESSAGE', escape(message.message))
                } else {
                    pair.admin.emit('MESSAGE', escape(message.message))
                }
            } else {
                socket.emit('MESSAGE', 'Please be patient. A support will contact you soon.');
            }
            
        }
    }

    getPairIndex(socket) {
        let user = this.paired.findIndex(pair => pair.user.id == socket.id) 
        let admin = this.paired.findIndex(pair => pair.admin.id == socket.id)

        return Math.max(user, admin);
    }

    getPair(socket) {
        let pair = this.paired[this.getPairIndex(socket)]

        return pair
    }
}

module.exports = Support