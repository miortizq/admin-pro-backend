
const { response } = require('express');

const Medico = require('../models/medico');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response) => {    
    
    try {
        
        const dato = req.params.dato;
        const regexp = new RegExp(dato, 'i');

        const [usuarios, medicos, hospitales] = await Promise.all([
            Usuario.find({"nombre": regexp}, 'nombre email role uid google img'),            
            Medico.find({"nombre": regexp}, 'nombre uid img'),
            Hospital.find({"nombre": regexp},'nombre uid img')
        ]);  
        
        return res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'})
    }
}

const getDocumentosColeccion = async (req, res = response) => {    
    
    try {
        
        const dato = req.params.dato;
        const tabla = req.params.tabla;

        const regexp = new RegExp(dato, 'i');

        let data = [];

        switch (tabla) {
            case 'usuarios':
                data = await Usuario.find({"nombre": regexp}, 'nombre email role uid google img');
                break;
        
            case 'medicos':
                data = await Medico.find({"nombre": regexp}, 'nombre img')
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre img');
                break;
            
            case 'hospitales':
                data = await Hospital.find({"nombre": regexp}, 'nombre img')
                                .populate('usuario', 'nombre img');
                break;
        
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La tabla no existe'});
        }
       
        return res.json({
            ok: true,
            resultados: data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'})
    }
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}