const authApiario = {};
const pool = require('../../database');
const {promisify} = require('util');
pool.query = promisify(pool.query);

authApiario.isAdminOrOwnerApiario = async (req, res, next) => {

    const idApicultor = req.user.ID_apicultor;
    const { id } = req.params;

    const sql = `
        select 
            *
        from
            Apicultor_tiene 
        where
            ID_apicultor = ? and ID_apiario = ?;
    `;

    const rows =  await pool.query(sql, [idApicultor, id]);
    if(rows.length > 0) {
        if(rows[0].ID_rol > 2) {
            req.flash('mensajeError', 'Usted no tiene permitido acceder al recurso solicitado');
            return res.redirect('/apicultores/perfil');
        } return next();
    } else {
        req.flash('mensajeError', 'Usted no tiene permitido acceder al recurso solicitado');
        return res.redirect('/apicultores/perfil');
    } 
    
};

module.exports = authApiario;

