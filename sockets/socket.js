const { io } = require('../index');
const Bands = require('../models/bands_model');
const Band = require('../models/band_model');

const bands = new Bands();

bands.addNewBand(new Band('Tri'));
bands.addNewBand(new Band('1D'));
bands.addNewBand(new Band('Metalica'));
bands.addNewBand(new Band('Nirvana'));

console.log(bands);

// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { console.log('Cliente desconectado') });

    // client.on('mensaje', (payload) => {
    //     console.log('Mensaje!', payload);

    //     io.emit('mensaje', { admin: 'Nuevo mensaje' });
    // });

    // client.on('emitir-mensaje', (payload) => {
    //     client.broadcast.emit('nuevo-mensaje', payload); // El cliente emite para los demás pero no para él mismo
    // });

    // Votar por una banda
    client.on('vote-band', (payload) => {
        bands.voteForBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // Agregar banda
    client.on('add-band', (payload) => {
        console.log(payload)
        bands.addNewBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    // Eliminar banda
    client.on('delete-band', (payload) => {
        console.log(payload)
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

});