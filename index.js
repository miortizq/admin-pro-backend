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

//conexion a base de datos
dbConnection();

//4BpIoyO4FEDnKQpm
//mean_user
//Rutas
/*se identifica el método para ejecutar el endpoint (get, post, put, delete, etc)
  se esperan 2 argumentos 
  El primer argumento indica el llamado que se va a ejecutar
  El segundo es un callback que se ejecuta cuando accede a la ruta. El callback recibe dos argumentos
  para una solictud http que son el request (datos de ingreso) y el response (datos de respuesta) */ 
app.get('/', (req, res) => {
    res.json(
        {
            ok: true,
            msg: 'Hola mundo'
        }
    );
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});