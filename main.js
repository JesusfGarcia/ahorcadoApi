let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
app.use(express.static('public'));

let messages = [
  {
    author: 'Carlos',
    text: 'Hola! que tal?',
  },
];

let users = [];
let rooms = [];
let uids = 0;

io.on('connection', socket => {
  console.log(`Èl cliente con IP ${socket.handshake.address} se ha conectado`);
  socket.emit('messages', messages);

  socket.on('new-message', data => {
    messages.push(data);
    io.sockets.emit('messages', messages);
  });
  //crear usuario
  socket.on('new-user', user => {
    let data = {
      ...user,
      ip: socket.handshake.address,
      uid: uids,
    };
    uids++;
    users.push(data);
    socket.emit('new-user', data);
    console.log(users);
  });
});

server.listen(8080, function () {
  console.log('Servidor corriendo en http://localhost:8080');
});
