
const { response } = require('express');
const { populate } = require('../models/medico');

const Medico = require('../models/medico');


const getMedicos = async (req, res = response) => {    
    
    try {
        
        const medicos = await Medico.find({},'nombre img')
                                        .populate('usuario', 'nombre')
                                        .populate('hospital','nombre');   
        
        console.log(medicos);
        
        return res.json({
            ok: true,
            medicos 
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'})
    }
}

const crearMedico = async (req, res = response) => {    

    try {
        
        const uid = req.uid;

        /* Se desestructura el modelo Hospital para poder asignar al usuario el uid que se encuentra en el body */
        const medico = new Medico({
            usuario: uid,
            ...req.body
        }); 
            
        const medicoDB = await medico.save();

        return res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const actualizarMedico = (req, res = response) => {    
    return res.json({
        ok: true,
        msg: 'actualizarMedicos'
    })
}

const eliminarMedico = (req, res = response) => {    
    return res.json({
        ok: true,
        msg: 'eliminarMedico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}