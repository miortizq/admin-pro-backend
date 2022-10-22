const { response }  = require("express");
const jwt           = require('jsonwebtoken');
const usuario       = require('../models/usuario');

/* Los middleware son funciones que se distinguen porque dentro de sus argumentos
   contiene el paramaetro next que indica que se puede continuar con la siguiente
   instrucción si esta funcion no presenta errores */
const validarJWT = (req, res = response, next) => {

    //Leer token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existe un token'
        })
    }

    try {
        
        /* El verify toma la semilla para intentar hacer match con la firma que tiene el token
        Si el verify no presenta error, se obtiene el uid del usuario  */
        const {uid} = jwt.verify(token,process.env.JWT_SECRET);

        //Se crea el valor uid en la request para identificar el usuario que realizó la solicitud
        req.uid = uid;

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

const validarRole = async (req, res, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para actualizar'
            });
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador'
        });
    }
}


const validarRole_MismoUsuario = async (req, res, next) => {

    const uid = req.uid;
    const idParam = req.params.id;

    try {

        const usuarioDB = await usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === idParam) {
            next();
        }
        else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para actualizar'
            });
        }        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador'
        });
    }
}


module.exports = {
    validarJWT,
    validarRole,
    validarRole_MismoUsuario
}