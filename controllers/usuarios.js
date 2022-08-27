const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWR } = require('../helpers/jwt');

/* Se importa el modelo de Momgoose para poder crear la información en la tabla */
const Usuario =require('../models/usuario');

/* Controlador para la petición de GetUsuarios */
const getUsuarios = async (req, res) => {
    
    const usuarios = await Usuario.find({},'nombre password role email google');    
    
    res.json(
        {
            ok: true,
            usuarios,
            uid: req.uid
        }
    );
}

/* Controlador para la petición de CreateUsuarios */
const createUsuarios = async (req, res = response) => {
    
    const {email, password} = req.body;

    try {
        
        /* Se ejecuta una búsqueda del usuario por email */
        const existeEmail = await Usuario.findOne({email});

        /* Si el registro existe, retorna error por llave duplicada */
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        /* El await indica que se debe esperar a que la promesa finalice para poder continuar
        Para que se pueda utilizar el await, se debe definir la función como Asyn, en este caso
        el callBack */
        await usuario.save() ;
 
        /* Crea token */
        const token = await generarJWR(usuario.id);
    
        res.json(
            {
                ok: true,
                usuario,
                token: token
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }
}

/* Controlador para la petición de CreateUsuarios */
const updateUsuario = async (req, res = response) => {

    const uid = req.params.id;   

    try {
        
        const usuarioDb = await Usuario.findById(uid);

        if (!usuarioDb) {
            return res.status(404).json(
                {
                    ok: false,
                    msg: 'Usuario no existe'
                }
            )
        }

        /* Se desestructura para extraer de los campos del body los datos que no se requieren
        password y google para este caso. */
        const {password, google, email, ...campos} = req.body;

        console.log('email1', req.body.email);
        

        /* Verifica si el email del usuario que llega es igual al email del usuario que se 
        consulta en la BD. De ser así, remueve el parámetro email de los campos */
        if (usuarioDb.email !== email)
        {
            const existeEmail = await Usuario.findOne( { email } );
            if (existeEmail) {
                return res.status(404).json(
                    {
                        ok: false,
                        msg: 'Ya existe usuario con este email'
                    }
                )
            }
        }

        /* Se adiciona nuevamente el email a los campos */
        campos.email = email;

        //Actualizacion
        /* Se adiciona el parametro new: true para que Mongoose me devuelva el registro actualizado,
           de lo contrario devuelve el registro antes de ser actualizado */
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error inesperado'
            }
        )
                
    }
}

/* Controlador para la petición de DeleteUsuarios */
const deleteUsuario = async (req, res = response) => {

    const uid = req.params.id;   

    try {
        
        const usuarioDb = await Usuario.findById(uid);

        if (!usuarioDb) {
            return res.status(404).json(
                {
                    ok: false,
                    msg: 'Usuario no existe'
                }
            )
        }

        //Eliminación
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            usuario: "Usuario eliminado"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error inesperado'
            }
        )                
    }
}

module.exports = {
    getUsuarios,
    createUsuarios,
    updateUsuario,
    deleteUsuario
}