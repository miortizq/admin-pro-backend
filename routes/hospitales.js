
/*
Ruta:  /api/hospitales
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');

const {getHospitales,crearHospital,actualizarHospital,eliminarHospital} = require('../controllers/hospitales');

/*se identifica el método para ejecutar el endpoint (get, post, put, delete, etc)
  se esperan 2 argumentos 
  El primer argumento indica el llamado que se va a ejecutar
  El segundo es un callback que se ejecuta cuando accede a la ruta. El callback recibe dos argumentos
  para una solictud http que son el request (datos de ingreso) y el response (datos de respuesta) 
  Este es el controlador cuando llegue una petición a la ruta /api/hospitales */ 
  router.get('/' , getHospitales);

  /* El segundo argumento del router es una coleccion de middlewares que se deben ejecutar */
  router.post('/', 
  [ validarJWT,
    check('nombre','Nombre hospital es obligatorio').not().isEmpty(),
    validarCampos
  ] ,crearHospital);

  /* Ruta para la actualización de Hospitales */
  router.put('/:id', 
  [
  ], actualizarHospital);

    /* Ruta para la eliminación de Hospitales */
    router.delete('/:id', eliminarHospital);

module.exports = router;

