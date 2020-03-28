const pool = require('../../database');
const { promisify } = require('util');
pool.query = promisify(pool.query);

module.exports = {

    async isAdminApiario(req, res, next) {

        const { idApiario } = req.params;
        const idApicultor = req.user.ID_apicultor;

        const sql = `
            select 
                *
            from
                Apicultor_tiene
            Where
                ID_apicultor = ? and ID_apiario = ? and ID_rol < 3;
        `;
        try {
            const rows = await pool.query(sql, [idApicultor, idApiario]);

            if (rows.length < 1) {
                req.flash('mensajeError', 'No tiene permitido acceder al recurso solicitado');
                return res.redirect('/colmenas/listar/1&' + idApiario);
            } else {
                return next();
            }
        } catch (error) {
            console.error('error en middleware isAdminApiario: ' + error);
            req.flash('mensajeError', 'Error al validar credenciales en Apiario');
            return res.redirect('/apicultores/perfil/1&'+ idApiario);
        }

    }

};