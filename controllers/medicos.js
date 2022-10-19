
const { response } = require('express');
const hospital = require('../models/hospital');
const { populate } = require('../models/medico');

const Medico = require('../models/medico');


const getMedicos = async (req, res = response) => {    
    
    try {
        
        const medicos = await Medico.find({},'nombre img')
                                        .populate('usuario', 'nombre')
                                        .populate('hospital','nombre');           
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

const getMedicoById = async (req, res = response) => {    
    
    try {
        
        const medicoId = req.params.id;

        const medico = await Medico.findById(medicoId,'nombre img')
                                        .populate('usuario', 'nombre')
                                        .populate('hospital','nombre');           
        return res.json({
            ok: true,
            medico 
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

const actualizarMedico = async (req, res = response) => {    
    
    const medicoId = req.params.id;
    //Id del usuario. Se encuentra dsponible porque en este punto ya pasamos por la autenticación del JWT
    const uid = req.uid;

    try {
        
        const medicoDB = Medico.findById(medicoId);

        if (!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado'
            });
        }

        //hospitalDB.nombre = req.body.nombre; esta es una manera de actualziar la data
        
        //Se obtiene los valores del body y se actualiza el usuario con el valor deisponible en la request
        const valoresMedico = {
            ...req.body,
            usuario: uid
        }

        /*Se solicita buscar y actualizar el médico, enviando el id que llega en los parámetros
        del request, los valores actualizados que se obtienen del body del request.
        Adicionalmente se solicita que el registro actualizado se cargue en la constante (medicoActualizado)*/
        const medicoActualizado = await Medico.findByIdAndUpdate(medicoId, valoresMedico, {new: true});

        return res.json({
            ok: true,
            hospital: medicoActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const eliminarMedico = async (req, res = response) => {    
    
    const medicoId = req.params.id;

    try {
        
        const medicoDB = Medico.findById(medicoId);

        if (!medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado'
            });
        }

        /*Se solicita buscar y actualizar el hospital, enviando el id que llega en los parámetros
        del request, los valores actualizados que se obtienen del body del request.
        Adicionalmente se solicita que el registro actualizado se cargue en la constante (hospitalActualizado)*/
        await Medico.findByIdAndDelete(medicoId);

        return res.json({
            ok: true,
            msg: 'Médico eliminado'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico,
    getMedicoById
}