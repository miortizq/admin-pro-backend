/* Modelo de Mongoose para Usuarios */

const { Schema, model} = require('mongoose');

/* Definición del esquema en Mongoose */
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
});

/* El objeto retorna el id como _id.
   Se puede configurar para cambiar este nombre. Esta es una afectación puramente visual 
   También se utiliza para no presentar determinada información (password, __v) en la salida del json */
UsuarioSchema.method('toJSON', function() {
    //Se obtienen los elementos __v, _id y el resto de elemento del objeto 
    const { __v, _id, password, ...object} = this.toObject();
    //Se crea el elemento uid y se le asigna el obtenido _id
    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);

