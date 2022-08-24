const mongoose = require('mongoose');

/*Al utilizar el Async, obliga a que la función retorne una promesa */
const dbConnection = async() => {

    try
    {
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');
    }
    catch (error)
    {
       console.log(error);
        throw new Error('Error al conectarse a la base de datos');
    }

}

module.exports = {
    dbConnection
};