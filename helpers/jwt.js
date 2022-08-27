const jwt = require('jsonwebtoken');

const generarJWR = (uid) => {

    return new Promise( (resolve, reject) => {

        const payload = {
            uid
        };
    
        /* Creación del token 
          Se envía el payload y la palabra clave (semilla)
          Se crean argumentos como la fecha de expiración del token
          Se ejecuta un callback que retorna un error de ser necesario y el token creado */
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el Token');
            } else {
                resolve(token);
            }
        });

    });
}

module.exports = {
    generarJWR
}