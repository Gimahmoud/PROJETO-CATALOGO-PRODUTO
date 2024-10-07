import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Escutar mudanças em produtos
export const onProductChange = (callback) => {
  socket.on('productChange', (data) => {
    callback(data);
  });
};

// Desconectar socket
export const disconnectSocket = () => {
  socket.disconnect();
};
