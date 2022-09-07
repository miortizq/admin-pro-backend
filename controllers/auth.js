const { response } = require("express");
const Usuario = require('../models/usuario');
const { generarJWR } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async(req, res = response) => {

    try {
        
        const {email, name, picture} = await googleVerify( req.body.token);

        //Crear el usuario de Google en Mongo
        const  usuarioDB = await Usuario.findOne({email});
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            })
        }
        else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar usuario
        await usuario.save();

        //Generar el Token -JWT
        const token = await generarJWR(usuario.id);
        
        res.json({
            ok: true,
            email, name, picture,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
        ok: false,
        msg: 'Token de Google no es correcto'
    })
    }
    
    
    

}

module.exports = {
    login,
    googleSignIn
}