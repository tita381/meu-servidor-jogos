
const express = require('express');
const app = express();

app.use(express.static(__dirname));

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Jogador conectado:', socket.id);

  socket.on('jogo1_comando', (dados) => {
    socket.broadcast.emit('jogo1_atualizar', dados);
  });

  socket.on('jogo2_comando', (dados) => {
    socket.broadcast.emit('jogo2_atualizar', dados);
  });

  socket.on('disconnect', () => {
    console.log('Jogador desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log('Servidor de jogos funcionando na porta:', PORT);
});
 express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*", // Regra crucial para o seu APK conseguir conectar de fora
    methods: ["GET", "POST"]
  }
});

// Resposta simples ao acessar o link no navegador (ajuda a saber se o Render está online)
app.get('/', (req, res) => {
  res.send('Servidor Central de Jogos Online - Rodando!');
});

// Gerenciador de conexões
io.on('connection', (socket) => {
  console.log(`Novo celular conectado: ${socket.id}`);

  // ==========================================
  // LÓGICA DO JOGO 1: JOGO DA VELHA
  // ==========================================
  socket.on('velha_jogada', (dados) => {
    // Repassa os dados da jogada para todos os celulares rodando o Jogo da Velha
    io.emit('velha_atualizar', dados);
  });

  // ==========================================
  // LÓGICA DO JOGO 2: CLICKER (QUEM CLICA MAIS RAPIDO)
  // ==========================================
  socket.on('clicker_ponto', (dados) => {
    // Envia o ponto novo para todos os celulares rodando o jogo Clicker
    io.emit('clicker_atualizar', dados);
  });

  // Quando o jogador fecha o aplicativo no celular
  socket.on('disconnect', () => {
    console.log(`Dispositivo desconectou: ${socket.id}`);
  });
});

// O Render define a porta automaticamente. Se falhar, usa a 3000
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
