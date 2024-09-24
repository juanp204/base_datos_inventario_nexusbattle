// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
mongoose.set('bufferCommands', false);
// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb+srv://Inventario:uFjKb8eSam571X8u@cluster0.kxdmz.mongodb.net/Inventario?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir rutas
app.use('/usuarios', require('./routes/usuarios'));
app.use('/subasta', require('./routes/subasta'));
app.use('/inventary', require('./routes/user_inventary'));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
