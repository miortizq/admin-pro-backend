const { response } = require('express')
const { validationResult } = require('express-validator');

/* Se crea un middleware personalizado. 
Recibe 3 argumentos - req(request), res(response) y 
next(indica que si pasa correctamente continua con el siguiente middleware) */
const validarCampos = (req, res = response, next) => {

    const errores = validationResult(req);

    if(!errores.isEmpty())
    {
        return res.status(400).json(
        {
            ok: false,
            errors: errores.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}