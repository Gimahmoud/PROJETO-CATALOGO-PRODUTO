const express = require('express');
const cors = require('cors');
const http = require('http');  // Necessário para o Socket.io
const { Server } = require('socket.io');
const sequelize = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const server = http.createServer(app);  // Criar o servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Permitir conexões do front-end
    methods: ["GET", "POST"]
  }
});

// Middleware para aceitar requisições no formato JSON
app.use(express.json());
app.use(cors());

// Definir as rotas de produtos
app.use('/products', productRoutes);

// Configurar o Socket.io para manipular conexões WebSocket
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  // Exemplo: escutar eventos enviados pelo cliente
  socket.on('productChange', (data) => {
    console.log('Produto alterado:', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Sincronizar o banco de dados com Sequelize e iniciar o servidor
const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco de dados sincronizado');
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });
