
/*
Ruta:  /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');

const {getMedicos,crearMedico,actualizarMedico,eliminarMedico} = require('../controllers/medicos');

/*se identifica el método para ejecutar el endpoint (get, post, put, delete, etc)
  se esperan 2 argumentos 
  El primer argumento indica el llamado que se va a ejecutar
  El segundo es un callback que se ejecuta cuando accede a la ruta. El callback recibe dos argumentos
  para una solictud http que son el request (datos de ingreso) y el response (datos de respuesta) 
  Este es el controlador cuando llegue una petición a la ruta /api/medicos */ 
  router.get('/' , getMedicos);

  /* El segundo argumento del router es una coleccion de middlewares que se deben ejecutar */
  router.post('/', 
  [ validarJWT,
    check('nombre','Nombre médico es obligatorio').not().isEmpty(),
    check('hospital','Hospital Id debe ser válido').isMongoId(),
    validarCampos ] 
    ,crearMedico);

  /* Ruta para la actualización de Medicos */
  router.put('/:id', 
  [ validarJWT,
    check('nombre','Nombre médico es obligatorio').not().isEmpty(),
    check('hospital','Hospital Id debe ser válido').isMongoId(),
    validarCampos 
  ], actualizarMedico);

    /* Ruta para la eliminación de Medicos */
    router.delete('/:id', eliminarMedico);

module.exports = router;

