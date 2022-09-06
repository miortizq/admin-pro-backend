/*
Ruta:  /api/todo/:dato
*/

const { Router } = require('express');

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');

const {getTodo, getDocumentosColeccion} = require('../controllers/busquedas');

/*se identifica el método para ejecutar el endpoint (get, post, put, delete, etc)
  se esperan 2 argumentos 
  El primer argumento indica el llamado que se va a ejecutar
  El segundo es un callback que se ejecuta cuando accede a la ruta. El callback recibe dos argumentos
  para una solictud http que son el request (datos de ingreso) y el response (datos de respuesta) 
  Este es el controlador cuando llegue una petición a la ruta /api/medicos */ 
  router.get('/:dato', validarJWT , getTodo);

  router.get('/coleccion/:tabla/:dato', validarJWT , getDocumentosColeccion);

  module.exports = router;