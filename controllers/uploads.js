const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');

const {actualizarImagen} = require('../helpers/actualizar-imagen');


const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];

    /* Validar que el tipo es válido  */
    if (!tiposValidos.includes(tipo)) 
    {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo ingresado no corresponde a medico, usuario u hospital'
        });
    };

    /* Validar que un archivo se está cargando */
    if (!req.files || Object.keys(req.files).length === 0) 
    {
        return res.status(400).json({
            ok: false,
            msg: 'Ningún archivo fue cargado'
        });
    };

    /* Procesar la imagen. El nombre asociado al req.files corresponde al nombre dado en el body 
    a la llave en form-data */

    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    //Validar extensión
    const extensionesValidas = ['png','gif','jpg','jpeg'];
    if (extensionesValidas.includes(extension))
    {
        return res.status(400).json({
            ok: false,
            msg: 'El archivo no tiene una extensión válida'
        });
    }
    //Nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${extension}`;
    //Path para guardar archivo
    const pathArchivo = `./uploads/${tipo}/${nombreArchivo}`;
    //Mover la imagen al respectivo directorio
    file.mv(pathArchivo, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error intentando cargar el archivo'
            });
        }   
        
        //Actualizar la base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo cargado',
            nombreArchivo
        });
      });
};


const retornaImagen = (req, res =response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);

    //verificar si el path existe
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }
    else
    {
        const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

    

}

module.exports = {
    fileUpload,
    retornaImagen
}