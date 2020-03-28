const pool = require('../../database');
const { promisify } = require('util');
pool.query = promisify(pool.query);

module.exports = {

    isLoggedIn(req, res, next) {

        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    },

    isNotLoggedIn(req, res, next) {

        if(!req.isAuthenticated()) {
            return next();
        }

        return res.redirect('/apicultores/perfil');
    },
    
    isAdminLoggedIn(req, res, next) {

        const sql = 'select ID_rolSistema from Apicultor where ID_apicultor = ?';

        pool.query(sql, [req.user.ID_apicultor], (err, rows) => {

            if(err) {
                console.error('Error en el metodo isAdminLoggedIn del archivo auth.js, el codigo es: '+err.code);
                res.redirect('/error');
            }

            if(rows.length > 0) {

                if(rows[0].ID_rolSistema == 1) {
                    return next();
                }
            }
            res.redirect('/error');
        });
    },

    async existeColmena(req, res, next) {

        
        const { id, currentPage, idApiario } = req.params;

        const sql = 'select * from Colmena where ID_colmena = ?';

        try {

            const rows = await pool.query(sql, [id]);

            if (rows.length > 0) {
                return next();
            } else {
                req.flash('mensajeError', 'El ID de Colmena solicitado no existe');
                res.redirect('/colmenas/listar/' + currentPage + '&' + idApiario);
            }

        } catch (error) {
            console.error('Error al autenticar colmena: ' + error);
            req.flash('mensajeError', 'Ha habido un error interno')
            res.redirect('/colmenas/listar/' + currentPage + '&' + idApiario);
        }

    }, 

    async existeApicultor(req, res, next) {

        const { id, currentPage } = req.params;

        const sql = 'select * from Apicultor where ID_apicultor = ?';

        try {

            const rows = await pool.query(sql, [id]);

            if (rows.length > 0) {
                return next();
            } else {
                req.flash('mensajeError', 'El Rut de Apicultor solicitado no existe');
                res.redirect('/apicultores/solicitudes/' + currentPage + '&0');
            }

        } catch (error) {
            console.error('Error al autenticar Apicultor: ' + error);
            req.flash('mensajeError', 'Ha habido un error interno')
            res.redirect('/apicultores/solicitudes/' + currentPage + '&0');
        }
    }
};