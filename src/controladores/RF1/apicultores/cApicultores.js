// Controlador de apicultores

const controlador = {};
const helpers = require('../../../lib/RF1/helpers');
const validarRut = require('validar-rut');
const nodemailer = require('nodemailer');

const { credencialesGmail } =  require('../../../mail');

const pool = require('../../../database');

// Renderizado de vistas
controlador.renderizarSolicitudes = async (req, res, next) => {

    // Definir la paginacion
    let perPage = 6;

    let { page , fecha } = req.params;

    let skip = ( page * perPage ) - perPage;
    let numPages;

    let sqlDatos;
    let sqlCantidad;

    if(fecha == 0) {
        sqlCantidad = 'select count(ID_apicultor) as cantidad_apicultores from Apicultor where ID_estado = 3';
        sqlDatos = 'select a.ID_apicultor, a.Nombre, a.Apellido_materno, a.Apellido_paterno, date_format(a.fecha_creacion, "%d-%m-%Y") as Fecha_creacion, e.Descripcion as Descripcion_estado from Apicultor a inner join Estado e on a.ID_estado = e.ID_estado where e.ID_estado = 3 order by ID_apicultor limit ? offset ?';
    } else {
        // Filtrar por Fecha
        if(fecha.length > 1) {
            console.log(fecha);
            sqlCantidad = 'select count(ID_apicultor) as cantidad_apicultores from Apicultor where ID_estado = 3 and Fecha_creacion like "%' + fecha + '%"';
            sqlDatos = 'select a.ID_apicultor, a.Nombre, a.Apellido_materno, a.Apellido_paterno, date_format(a.fecha_creacion, "%d-%m-%Y") as Fecha_creacion, e.Descripcion as Descripcion_estado from Apicultor a inner join Estado e on a.ID_estado = e.ID_estado where e.ID_estado = 3 and a.Fecha_creacion like "%'+ fecha + '%" order by ID_apicultor limit ? offset ?';
        }
    }

    await pool.query(sqlCantidad, async (err, rows) => {
        
        if(err) {
            req.flash('mensajeError', 'Error al listar solicitudes: ' + err.code);
            res.redirect('/apicultores/solicitudes/' + page + '&0' + '&0');
            return;
        }


        numPages = Math.ceil( rows[0].cantidad_apicultores / perPage );

        await pool.query(sqlDatos, [perPage, skip], async (err, rows) => {

            if (err) {
                console.error('Hubo un error en la consulta, en el método renderizarSolicitudes de cApicultores.js, el codigo es: ' + err.code);
                res.redirect('/apicultores/solicitudes/' + page + '&0' + '&0');
            }

            // console.log(numPages);
            res.render('RF1/apicultores/solicitudes', {
                data: rows,
                current: page,
                pages: numPages,
                perPage,
                fechaFiltro: fecha
            });
        });
    });

};

controlador.renderizarAceptados= async (req, res) => {

    const idApicultor = req.user.ID_apicultor;
    // Definir la paginacion
    let perPage = 6;
    let { page, fecha } = req.params || 1;
    let skip = ( page * perPage ) - perPage;
    let numPages;

    let sqlDatos;
    let sqlCantidad;

    if(fecha == 0) {
        sqlCantidad = 'select count(ID_apicultor) as cantidad_apicultores from Apicultor where ID_estado = 1 and ID_apicultor != ?';
        sqlDatos = 'select a.ID_apicultor, a.Nombre, a.Apellido_materno, a.Apellido_paterno, date_format(a.fecha_creacion, "%d-%m-%Y") as Fecha_creacion, r.ID_rolSistema, r.Descripcion as Descripcion_rolSistema, e.Descripcion as Descripcion_estado from Apicultor a inner join Estado e on a.ID_estado = e.ID_estado inner join RolSistema r on a.ID_rolSistema = r.ID_rolSistema where a.ID_apicultor != ? and e.ID_estado = 1 order by a.ID_apicultor limit ? offset ?';
    } else {
        // Filtrar por Fecha
        if(fecha.length > 1) {
            sqlCantidad = 'select count(ID_apicultor) as cantidad_apicultores from Apicultor where ID_apicultor != ? and ID_estado = 1 and Fecha_creacion like "%' + fecha + '%"';
        sqlDatos = 'select a.ID_apicultor, a.Nombre, a.Apellido_materno, a.Apellido_paterno, date_format(a.fecha_creacion, "%d-%m-%Y") as Fecha_creacion, r.ID_rolSistema, r.Descripcion as Descripcion_rolSistema, e.Descripcion as Descripcion_estado from Apicultor a inner join Estado e on a.ID_estado = e.ID_estado inner join RolSistema r on a.ID_rolSistema = r.ID_rolSistema where a.ID_apicultor != ? and e.ID_estado = 1 and  a.Fecha_creacion like "%' + fecha + '%" order by a.ID_apicultor limit ? offset ?';
        }
    }

    await pool.query(sqlCantidad, [idApicultor], async (err, rows) => {
        
        if(err) {
            console.error(err.code + 'asd');
            return;
        }

        numPages = Math.ceil( rows[0].cantidad_apicultores / perPage );

        // const query = 'select a.ID_apicultor, a.Nombre, a.Apellido_materno, a.Apellido_paterno, date_format(a.fecha_creacion, "%d-%m-%Y / Hora: %h:%m") as Fecha_creacion, r.ID_rolSistema, r.Descripcion as Descripcion_rolSistema, e.Descripcion as Descripcion_estado from Apicultor a inner join Estado e on a.ID_estado = e.ID_estado inner join RolSistema r on a.ID_rolSistema = r.ID_rolSistema where e.ID_estado = 1 order by ID_apicultor limit ? offset ?';


        await pool.query(sqlDatos, [idApicultor, perPage, skip], async (err, rows) => {

            if (err) {
                console.error('Hubo un error en la consulta, en el método renderizarAceptados de cApicultores.js, el codigo es: ' + err.code);
                res.redirect('/apicultores/aceptados/1&0');
            }

            res.render('RF1/apicultores/aceptados', {
                data: rows,
                current: page,
                pages: numPages,
                fechaFiltro: fecha,
                perPage
            });
        });
    });
};

controlador.renderizarPerfil =  async (req, res) => {
    res.render('RF1/apicultores/perfil');
};

controlador.renderizarDatos =  (req, res) => {
    res.render('RF1/apicultores/datos');
};

controlador.renderizarModificarDatos = (req, res) => {
    res.render('RF1/apicultores/modificarDatos');
};

controlador.renderizarCambiarPassword = (req, res) => {
    res.render('RF1/apicultores/cambiarPassword');
};

controlador.renderizarFormularioRechazo = async (req, res) => {

    const { id, currentPage } = req.params;

    await pool.query('select * from Apicultor where ID_apicultor = ?', [id], async (err, rows) => {

        if(err) {
            console.error(err.code);
            req.flash(err.code);
            res.render('RF1/apicultores/solicitudes/' + currentPage);
            return;
        }

        res.render('RF1/apicultores/rechazarSolicitud', {a: rows[0], currentPage});
    });
};

controlador.renderizarCambiarRol = async (req, res) => {

    const {id, currentPage, fecha} = req.params;

    const sqlApicultor = 'select a.ID_rolSistema, r.Descripcion, a.* from Apicultor a inner join RolSistema r on a.ID_rolSistema = r.ID_rolSistema where ID_apicultor = ?'
    
    const sqlRolSistema = 'select * from RolSistema';

    await pool.query(sqlApicultor, [id], async (err, rows) => {
        
        if(err) {
            req.flash('mensajeError', err.code);
            res.redirect('/apicultores/aceptados/'+currentPage);
        }

        if (rows.length < 1) {
            req.flash('mensajeError', 'El apicultor seleccionado ya no existe en la base de datos');
            res.redirect('/apicultores/aceptados/'+currentPage);
        }

        const apicultor = rows[0];
    
        if (apicultor.ID_estado == 2) {
            req.flash('mensajeError', 'No es posible asignar nuevo rol, puesto que, el apicultor seleccionado esta inactivo');
            res.redirect('/apicultores/aceptados/'+currentPage);
        }
    
        if (apicultor.ID_estado == 3) {
            req.flash('mensajeError', 'No es posible asignar nuevo rol, puesto que, el apicultor seleccionado aun no ha sido aprobado por un administrador');
            res.redirect('/apicultores/aceptados/'+currentPage);
        }
    
        if (apicultor.ID_rolSistema == 1) {
            req.flash('mensajeError', 'No es posible modificar el rol de un usuario administrador del sistema');
            res.redirect('/apicultores/aceptados/'+currentPage);
        }

        await pool.query(sqlRolSistema, (err, rows) => {

            if(err) {
                req.flash('mensajeError', err.code);
                res.redirect('/apicultores/aceptados/'+currentPage);
            }
    
            if (rows.length < 1) {
                req.flash('mensajeError', 'No existen estados registrados para los apicultores en la base de datos');
                res.redirect('/apicultores/aceptados/'+currentPage);
            }

            const rolSistema = rows;

            res.render('RF1/apicultores/cambiarRol', {
                a: apicultor,
                rolSistema,
                currentPage,
                fechaFiltro: fecha
            });
        });
    });

};


// Logica de negocios
controlador.aceptarSolicitud = async (req, res) => {

    const { id, page, fecha } = req.params;
    const { currentPage } = req.body;

    await pool.query('select Nombre, Correo, date_format(Fecha_creacion, "%d-%m-%Y / Hora: %h:%m") as Fecha_creacion from Apicultor where ID_apicultor = ?', [id], async (err, rows) => {
        
        if(err) {
            console.log(err);
            req.flash('mensajeError', 'Error: ' + err + '. No se ha podido aceptar la solicitud de registro con Rut: '+id);
            res.redirect('/apicultores/solicitudes/'+currentPage+'&0');
        }

        if(rows.length < 1) {
            req.flash('mensajeError', 'Error: (No existe id de usuario que se esta solicitando a la base de datos)' + err + '. No se ha podido aceptar la solicitud de registro con Rut: '+id);
            res.redirect('/apicultores/solicitudes/'+currentPage+'&0');
        }

        const { Nombre, Correo, Fecha_creacion } = rows[0];

         contenidoHTML = `
            <h1> Estimado/a ` + Nombre + `</h1>
            <p> Su solicitud de registro, con fecha de creacion ` + Fecha_creacion + ` ha sido aceptada.</p>
            <br>
            <p>ya puede acceder al sistema usando sus datos de registro.</p>
            <p>`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: credencialesGmail.user,
                   pass: credencialesGmail.password
               }
        });

        const mailOptions = {
            from: credencialesGmail.user, // sender address
            to: credencialesGmail.user, // list of receivers
            subject: 'test', // Subject line
            html: contenidoHTML// plain text body
        };

        try {

            const info = await transporter.sendMail(mailOptions); 

            if(info.messageId) {

                try {

                    await pool.query('update Apicultor set ID_estado = 1 where ID_apicultor = ?', [id]);
 
                    req.flash('mensajeCorrecto', 'Correo enviado y solicitud aceptada correctamente');
                    res.redirect('/apicultores/solicitudes/'+currentPage+'&0');
                    
                } catch (error) {
                    req.flash('mensajeError', 'Ha habido un error al modificar el estado de cuenta de la solicitud de registr: ' + error.code + ' ... En consecuencia no se ha podido aceptar la solicitud de registro con Rut: '+id);
                    res.redirect('/apicultores/solicitudes/'+currentPage+'&0');
                }
            }
        } catch (error) {
            req.flash('mensajeError', 'Ha habido un error al enviar correo de aceptación: ' + error.code + ' ... En consecuencia no se ha podido aceptar la solicitud de registro con Rut: '+id);
            res.redirect('/apicultores/solicitudes/'+currentPage+'&0');
        }
    });
};

controlador.rechazarSolicitud = async (req, res) => {

    const { id } = req.params;
    const { motivoRechazo, currentPage } = req.body;

    await pool.query('select Nombre, Correo, date_format(Fecha_creacion, "%d-%m-%Y / Hora: %h:%m") as Fecha_creacion from Apicultor where ID_apicultor = ?', [id], async (err, rows) => {

        if(err) {
            console.error(err.code);
            req.flash('mensajeError', 'ha habido un error al rechazar la solicitud: '+err.code);
            res.redirect('/apicultores/formularioRechazo/'+id+'&'+currentPage);
        }

        const { Nombre, Correo, Fecha_creacion } = rows[0];

         contenidoHTML = `
            <h1> Estimado/a ` + Nombre + `</h1>
            <p> Lamentamos informarle que su solicitud de registro, con fecha de creacion ` + Fecha_creacion + ` ha sido rechazada.</p>
            <p> El motivo: </p>
            <br>
            <p>` + motivoRechazo;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: credencialesGmail.user,
                   pass: credencialesGmail.password
               }
        });

        const mailOptions = {
            from: credencialesGmail.user, // sender address
            to: Correo, // list of receivers
            subject: 'Información Solicitud de Registro a Apicultores', // Subject line
            html: contenidoHTML// plain text body
        };

        try {

            const info = await transporter.sendMail(mailOptions); 

            if(info.messageId) {

                try {

                    await pool.query('delete from Apicultor where ID_apicultor = ?', [id]);
 
                    req.flash('mensajeCorrecto', 'Correo enviado y solicitud de registro rechazada correctamente');
                    res.redirect('/apicultores/solicitudes/'+currentPage+'&0');
                    
                } catch (error) {
                    req.flash('mensajeError', 'Ha habido al eliminar la solicitud de la base de datos: ' + error.code + ' ... En consecuencia no se ha podido rechazar la solicitud de registro con Rut: '+id);
                    res.redirect('/apicultores/solicitudes/'+currentPage+'&0');
                }
            }
        } catch (error) {
            req.flash('mensajeError', 'Ha habido un error al enviar correo de rechazo: ' + error.code + ' ... En consecuencia no se ha podido rechazar la solicitud de registro con Rut: '+id);
            res.redirect('/apicultores/formularioRechazo/'+id+'&'+currentPage);
        }
    });
};

controlador.cambiarRol = async (req, res) => {
    
    const { id, page, fecha } = req.params;
  
    const { selectRol, currentPage  } = req.body;

    const sql = 'Update Apicultor set ID_rolSistema = ? where ID_apicultor = ?';

    await pool.query(sql, [selectRol, id], (err, result) => {

        if(err) {
            req.flash('mensajeError', 'Error al intentar cambiar el rol de usuario: '+err.code);
            res.redirect('/apicultores/cambiarRol/'+id+'&'+page+'&'+fecha);
        }

        req.flash('mensajeCorrecto', 'Rol de sistema actualizado correctamente: ');
        res.redirect('/apicultores/aceptados/'+currentPage+'&'+fecha);
        
    });
};

controlador.eliminarApicultor = async (req, res) => {

    const { id } = req.params;

    await pool.query('SELECT rol_apicultor FROM Apicultor WHERE id = ?', [id], async (err, rows) => {

        if (err) {
            console.error('Hubo un error en la consulta, en el método eliminarApicultor(1) de controladorUsuarios.js, el codigo es: ' + err.code);
            return;
        }

        if (rows[0].rol_apicultor == 1) {
            req.flash('mensajeError', 'No es posible eliminar un apicultor con rol administrador');
            res.redirect('/listarApicultoresAceptados');
        } else {
            await pool.query('DELETE FROM Apicultor WHERE id = ?', [id], async (err, rows) => {

                if (err) {
                    console.error('Hubo un error en la consulta, en el método eliminarApicultor(2) de controladorUsuarios.js, el codigo es: ' + err.code);
                    return;
                }

                console.log('Se ha eliminado correctamente el apicultor');

                req.flash('mensajeCorrecto', 'Apicultor eliminado correctamente');
                res.redirect('/apicultores/aceptados');
            });
        }
    });
};

controlador.guardarDatos = async (req, res) => {
 
    const { correo, nombre, apellidoPaterno, apellidoMaterno } = req.body;

    const nuevoApicultor = {
        ID_apicultor: req.user.ID_apicultor,
        Correo: correo,
        Nombre: nombre,
        Apellido_paterno: apellidoPaterno,
        Apellido_materno: apellidoMaterno
    };

    // if(rut.length< 1) {
    //     req.flash('mensajeError', 'Debe ingresar el rut completo');
    //     res.redirect('/apicultores/modificarDatos');
    // }

    // if(!validarRut.validar(rut)) {
    //     req.flash('mensajeError', 'Debe ingresar el rut completo');
    //     res.redirect('/apicultores/modificarDatos');
    // }

    if(correo.length< 1) {
        req.flash('mensajeError', 'Debe ingresar su correo');
        res.redirect('/apicultores/modificarDatos');
    }

    if(nombre.length< 1) {
        req.flash('mensajeError', 'Debe ingresar su nombre');
        res.redirect('/apicultores/modificarDatos');
    }

    if(apellidoPaterno.length< 1) {
        req.flash('mensajeError', 'Debe ingresar apellido paterno');
        res.redirect('/apicultores/modificarDatos');
    }

    if(apellidoMaterno.length< 1) {
        req.flash('mensajeError', 'Debe ingresar apellido materno');
        res.redirect('/apicultores/modificarDatos');
    }

    await pool.query('update Apicultor set ? where ID_apicultor = ?', [nuevoApicultor, req.user.ID_apicultor], (err, result) => {

        if(err) {
            console.error('Error al modificar los datos del apicultor, el codigo es: '+err.code);
            return;
        }

        console.log('datos modificados correctamente');
        req.flash('mensajeCorrecto', 'Datos modificados correctamente');
        res.redirect('/apicultores/datos');
    });

};

controlador.guardarPassword = async (req, res) => {

    const { password } = req.body;

    if(password.length < 1) {
        req.flash('mensajeError', 'Debe ingresar una contraseña');
        res.redirect('/apicultores/cambiarPassword');
        return;
    }

    const nuevaPassword = await helpers.encriptarPassword(password);

    pool.query('update Apicultor set contrasena = ? where id_apicultor = ?', [nuevaPassword, req.user.ID_apicultor], (err, result) => {

        if(err) {
            console.err('Error al cambiar contraseña del apicultor, el codigo es: '+err.code);
            return;
        }

        console.log('contraseña modificada correctamente');
        req.flash('mensajeCorrecto', 'Contraseña actualizada');
        res.redirect('/apicultores/datos');

    });
};


module.exports = controlador;