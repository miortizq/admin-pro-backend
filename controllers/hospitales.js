const { response } = require('express');

const Hospital = require('../models/hospital');


const getHospitales = async (req, res = response) => {    
    
    try {
        
        const hospitales = await Hospital.find()
                                        .populate('usuario', 'nombre');        
        
        return res.json({
        ok: true,
        hospitales})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        ok: false,
        msg: 'Error inesperado'})
    }
}

const crearHospital = async (req, res = response) => {    
    
    try {
        const uid = req.uid;
        /* Se desestructura el modelo Hospital para poder asignar al usuario el uid que se encuentra en el body */
        const hospital = new Hospital({
            usuario: uid,
            ...req.body
        }); 
            
        const hospitalDB = await hospital.save();

        return res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
 
}

const actualizarHospital = (req, res = response) => {    
    return res.json({
        ok: true,
        msg: 'actualizarHospitales'
    })
}

const eliminarHospital = (req, res = response) => {    
    return res.json({
        ok: true,
        msg: 'eliminarHospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}