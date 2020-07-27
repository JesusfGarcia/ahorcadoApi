let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
app.use(express.static('public'));

let rooms = [];

let palabras = [
  'cuello',
  'gato',
  'perro',
  'raton',
  'puerta',
  'rinoceronte',
  'arandano',
  'frambuesa',
  'fresa',
  'grosella',
  'zarzamora',
  'mora',
  'limon',
  'mandarina',
  'naranja',
  'guayaba',
  'pomelo',
  'melon',
  'sandia',
  'carambola',
  'chirimoya',
  'datil',
  'litchi',
  'mango',
  'papaya',
  'melon',
  'piña',
  'platano',
  'manzana',
  'cereza',
  'ciruela',
  'higo',
  'pera',
  'uva',
  'almendr',
  'avellana',
  'cacahuate',
  'nuez',
  'pistache',
  'cibernetica',
  'circuito',
  'computacion',
  'desarrollo',
  'digital',
  'diseño',
  'dispositivo',
  'domatica',
  'hardware',
  'software',
  'comunicacion',
  'informatica',
  'interface',
  'chip',
  'res',
  'robotica',
  'internet',
  'alergia',
  'antibiotico',
  'antidoto',
  'caloria',
  'cicatrizar',
  'cirugia',
  'clinica',
  'curacion',
  'diagnostico',
  'enfermedad',
  'epidemia',
  'farmacia',
  'farmaco',
  'hematologo',
  'hidratacion',
  'higiene',
  'hospital',
  'inmunidad',
  'inocular',
  'insulina',
  'inyeccion',
  'medicamento',
  'neurologia',
  'ortodoncia',
  'oftalmologia',
  'patologia',
  'pediatria',
  'terapia',
  'vacuna',
  'vitamina',
  'antologia',
  'articulo',
  'bibliografia',
  'biblioteca',
  'caligrafia',
  'canon',
  'capitulo',
  'certamen',
  'critica',
  'cuento',
  'dedicatoria',
  'dialogo',
  'divulgacion',
  'dditor',
  'editorial',
  'ensayo',
  'epica',
  'epilogo',
  'epopeya',
  'escritor',
  'etimologia',
  'fonetica',
  'genero',
  'hramatica',
  'lexico',
  'leyenda',
  'libreria',
  'libro',
  'lirica',
  'mitologia',
  'papel',
  'pagina',
  'prologo',
  'ortografia',
  'prosa',
  'retorica',
  'trama',
  'sinopsis',
  'verso',
  'poema',
  'articulo',
  'carcel',
  'complice',
  'constitucion',
  'leyes',
  'contrato',
  'convenio',
  'corrupcion',
  'crimen',
  'custodia',
  'delito',
  'denuncia',
  'derecho',
  'derogar',
  'defensa',
  'diligencia',
  'edicto',
  'fallo',
  'fianza',
  'juez',
  'jurado',
  'jurisdiccion',
  'legislacion',
  'ley',
  'patrimonio',
  'reglamento',
  'testigo',
  'tribunal',
  'veredicto',
  'sancion',
  'querella',
  'libertad',
  'acuifero',
  'aire',
  'alga',
  'anfibio',
  'arena',
  'arroyo',
  'atmosfera',
  'biosfera',
  'bosque',
  'cenote',
  'ciclon',
  'clima',
  'biomasa',
  'bosque',
  'cueva',
  'ecologia',
  'ecosistema',
  'especie',
  'fauna',
  'flora',
  'habitat',
  'hielo',
  'meseta',
];

io.on('connection', socket => {
  //crear usuario
  socket.on('new-user', user => {
    nick = user.nick;
    socket.nick = user.nick;
    socket.emit('new-user', { nick: socket.nick });
  });

  //Crear habitación
  socket.on('new-room', data => {
    rooms.push(data);
    socket.room = data.id;
    socket.join(data.id);
    socket.emit('new-room', socket.room);
    io.emit('get-rooms', rooms);
  });

  //unirse a habitación
  socket.on('join-room', data => {
    socket.join(data);
    socket.room = data;
    socket
      .to(data)
      .emit('message', `el usuario ${socket.nick} ha ingresado a la partida`);
  });

  //getrooms
  socket.on('get-rooms', () => {
    io.emit('get-rooms', rooms);
  });
  //prueba

  //getnumberofClients
  socket.on('cuantossomos', () => {
    let clients = socket.adapter.rooms[socket.room];
    if (clients.length === 2) {
      let item = palabras[Math.floor(Math.random() * palabras.length)];

      setTimeout(function () {
        io.to(socket.room).emit('empezarPartida', item);
      }, 2000);
    }
  });

  //seleccion de letra
  socket.on('selec-letra', letra => {
    socket.to(socket.room).emit('selec-letra', letra);
  });

  //finsh
  socket.on('finish', () => {
    let clients = socket.adapter.rooms[socket.room];
    if (clients.length < 2) {
      let newRooms = rooms.filter(item => item.id !== socket.room);
      rooms = newRooms;
    }
    socket.leave(socket.room);
  });
});

server.listen(8080, function () {
  console.log('Servidor corriendo en http://localhost:8080');
});
