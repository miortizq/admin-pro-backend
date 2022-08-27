const { response } = require("express");
const Usuario = require('../models/usuario');
const { generarJWR } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {      

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no autorizadas - email'
            })
        }

        //Verificar contraseña
        const validaPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validaPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no autorizadas - password'
            })
        }

        //Generar el token
        const token = await generarJWR( usuarioDB.id);

        return res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el administrador'
        })
    }
}


module.exports = {
    login
}