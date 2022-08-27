const { response } = require("express");
const jwt = require('jsonwebtoken');

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

module.exports = {
    validarJWT
}