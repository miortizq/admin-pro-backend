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

const actualizarHospital = async (req, res = response) => {    
    
    const hospitalId = req.params.id;
    //Id del usuario. Se encuentra dsponible porque en este punto ya pasamos por la autenticación del JWT
    const uid = req.uid;

    try {
        
        const hospitalDB = Hospital.findById(hospitalId);

        if (!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        //hospitalDB.nombre = req.body.nombre; esta es una manera de actualziar la data
        
        //Se obtiene los valores del body y se actualiza el usuario con el valor deisponible en la request
        const valoresHospital = {
            ...req.body,
            usuario: uid
        }

        /*Se solicita buscar y actualizar el hospital, enviando el id que llega en los parámetros
        del request, los valores actualizados que se obtienen del body del request.
        Adicionalmente se solicita que el registro actualizado se cargue en la constante (hospitalActualizado)*/
        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId, valoresHospital, {new: true});

        return res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}    
    

const eliminarHospital = async (req, res = response) => {    
    
    const hospitalId = req.params.id;

    try {
        
        const hospitalDB = Hospital.findById(hospitalId);

        if (!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        /*Se solicita buscar y actualizar el hospital, enviando el id que llega en los parámetros
        del request, los valores actualizados que se obtienen del body del request.
        Adicionalmente se solicita que el registro actualizado se cargue en la constante (hospitalActualizado)*/
        await Hospital.findByIdAndDelete(hospitalId);

        return res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}