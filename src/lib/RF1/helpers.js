const bcrypt = require('bcryptjs');
const helpers = {};

// Encriptar contraseña durante el registro del usuario
// El nombre del metodo ("encryptPassword") es a eleccion propia

helpers.encriptarPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt) ;
    return passwordEncriptado;
};

// Desencriptar contraseña durante el login del usuario

helpers.compararPassword = async (password, passwordEncriptado) => {

    try {
        const resultado =  await bcrypt.compare(password, passwordEncriptado);
        return resultado;
        
    } catch (error) {

        console.log(error);
    }
};

module.exports = helpers;