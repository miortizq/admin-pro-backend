/* Modelo de Mongoose para Hospitales */

const { Schema, model} = require('mongoose');

/* Definición del esquema en Mongoose 
   Para asignar el nombre de la tabla se utiliza collection:*/
const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {collection : 'hospitales'});

/* El objeto retorna el id como _id.
   Se puede configurar para cambiar este nombre. Esta es una afectación puramente visual 
   También se utiliza para no presentar determinada información (password, __v) en la salida del json */
HospitalSchema.method('toJSON', function() {
    //Se obtienen los elementos __v, _id y el resto de elemento del objeto 
    const { __v, _id, ...object} = this.toObject();
    //Se crea el elemento uid y se le asigna el obtenido _id
    object.uid = _id;
    return object;
})

module.exports = model('Hospital', HospitalSchema);

