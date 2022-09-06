/* Importación de express a través de node */
const express = require('express');
require('dotenv').config();
const cors = require('cors')
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

//Configurar CORS
//Use es un middleware = función que se ejecuta siempre que pasa por este punto
app.use(cors());

//Lectura y Parseo del Body
app.use(express.json());

//conexion a base de datos
dbConnection();

//4BpIoyO4FEDnKQpm
//mean_user
//Rutas
/* Se crea un middleware que permita que cualquier petición que venga por /api/usuarios será respondida
   por la implementación que se encuentra en el archivo ./routes/usuarios */
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});