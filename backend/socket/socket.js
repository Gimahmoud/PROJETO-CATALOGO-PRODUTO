let io;

const initSocket = (serverIo) => {
  io = serverIo;
  io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
};

const emitProductChange = (action, product) => {
  if (io) {
    io.emit('productChange', { action, product });
  }
};

module.exports = { initSocket, emitProductChange };
