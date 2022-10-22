/*
Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();
const { getUsuarios, createUsuarios, updateUsuario, deleteUsuario } = require('../controllers/usuarios');
const { validarJWT, validarRole, validarRole_MismoUsuario } = require('../middlewares/validar-jwt');

/*se identifica el método para ejecutar el endpoint (get, post, put, delete, etc)
  se esperan 2 argumentos 
  El primer argumento indica el llamado que se va a ejecutar
  El segundo es un callback que se ejecuta cuando accede a la ruta. El callback recibe dos argumentos
  para una solictud http que son el request (datos de ingreso) y el response (datos de respuesta) 
  Este es el controlador cuando llegue una petición a la ruta /api/usuarios */ 
  router.get('/', validarJWT , getUsuarios);

  /* El segundo argumento del router es una coleccion de middlewares que se deben ejecutar */
  router.post('/', 
  [
    //validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio y debe tener el formato correcto').isEmail(),
    validarCampos
  ] ,createUsuarios);

  /* Ruta para la actualización de usuarios */
  router.put('/:id', 
  [
    validarJWT,
    validarRole_MismoUsuario,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio y debe tener el formato correcto').isEmail(),
    check('role','El rol es obligatorio').not().isEmpty(),
    validarCampos
  ], updateUsuario);

    /* Ruta para la eliminación de usuarios */
    router.delete('/:id', validarJWT, deleteUsuario);

module.exports = router;