const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');
const rut = require('validar-rut');
const validator = require("email-validator");

const pool = require('../../database');

passport.use('local.login', new LocalStrategy({
    usernameField: 'rut',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    if(!rut.validar(username)) {
        return done(null, false, req.flash('mensajeError', 'El rut ingresado no es valido'));
    }

    if(password.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Ingrese su contraseña'));
    }
   
    await pool.query('SELECT * from Apicultor WHERE ID_apicultor = ?', [username], async (err, rows) => {
        
        if(err) {
            console.error('error al listar el apicultor, el error es '+err.code);
        }

        if (rows.length > 0) {
            const user = rows[0];
            user.id = rows[0].ID_apicultor;

            if(user.ID_estado == 3) {
                return done(null, false, req.flash('mensajeError', 'Su solicitud de registro aún no ha sido revisada por un administrador'));
            }

            let passwordValida = await helpers.compararPassword(password, user.Contrasena);

            if(passwordValida) {
                done(null, user, req.flash('mensajeCorrecto', 'Bienvenido'));

            } else {
                done(null, false, req.flash('mensajeError', 'Contraseña incorrecta'));
            }
        } else {
            return done(null, false, req.flash('mensajeError', 'El rut ingresado no esta registrado'));
        } 
    });
}));

// Solicitud de registro de nuevos apicultores
passport.use('local.registro', new LocalStrategy({
    usernameField: 'rut',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    
    const { correo, nombre, apellidoPaterno, apellidoMaterno } = req.body;

    dataForm.tempData = {
        rut: username,
        correo,
        nombre,
        apellidoPaterno,
        apellidoMaterno
    };

    if(username.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Debe ingresar el rut completo'));
    }

    if(!rut.validar(username)) {
        return done(null, false, req.flash('mensajeError', 'El rut ingresado no es valido'));
    }

    if(correo.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Debe ingresar su correo'));
    }

    if(!validator.validate(correo)) {
        return done(null, false, req.flash('mensajeError', 'Debe ingresar un correo valido'));
    } 

    if(nombre.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Debe ingresar su nombre'));
    }

    if(apellidoPaterno.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Debe ingresar appelido paterno'));
    }

    if(apellidoMaterno.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Debe ingresar appelido materno'));
    }

    if(password.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Ingrese su contraseña'));
    }

    if(password.length < 1) {
        return done(null, false, req.flash('mensajeError', 'Ingrese su contraseña'));
    }

    const nuevoApicultor = {
        ID_apicultor: username,
        correo,
        nombre,
        Apellido_paterno: apellidoPaterno,
        Apellido_materno: apellidoMaterno,
      // fecha_creacion, se crea automaticamente al ingresar el apicultor   
      };
   
    // Comprobar que es el primer apicultor en registrarse para registrarlo como el dueño de la app
    await pool.query('select * from Apicultor', async (err, rows) => {
        
        if(err) res.send(err.code);

        if(rows.length < 1) {
            nuevoApicultor.ID_estado = 1
            nuevoApicultor.ID_rolSistema = 1
        } else  {
            nuevoApicultor.ID_estado = 3
            nuevoApicultor.ID_rolSistema = 2
        }

        nuevoApicultor.Contrasena = await helpers.encriptarPassword(password);

        await pool.query('SELECT * FROM Apicultor WHERE Id_apicultor = ?', [nuevoApicultor.ID_apicultor], async (err, rows) => {
            
            if(err) res.send(err.code);
            
            if(rows.length > 0) {

                if(rows[0].ID_apicultor == nuevoApicultor.ID_apicultor) {
                    return done(null, false, req.flash('mensajeError', 'El rut ingresado ya se encuentra registrado'));
                }  
            } else {

                await pool.query('INSERT INTO Apicultor SET ? ', nuevoApicultor, (err, result) => {

                    console.log('hola');
                    if(err) {
                        console.error('error al registrar apicultor, el codigo es: '+err.code);
                        return;
                    }
        
                    console.log('apicultor registrado correctamente');
                    req.flash('mensajeCorrecto', 'Solicitud de registro enviada, podra acceder a su perfil cuando un administrador apruebe su solicitud');
                    delete dataForm.tempData;
                    return done(null, false);
                });
            }
        });

    });

}));

passport.serializeUser((user, done) => {

    done(null, user.id);

});
  
passport.deserializeUser(async (id, done) => {

    await pool.query('SELECT * FROM Apicultor WHERE ID_apicultor = ?', [id], async (err, rows) => {

        const user = rows[0];

        const sql = 'select ID_rolSistema from Apicultor where ID_apicultor = ?';

        await pool.query(sql, [id], (err, rows) => {

            if(err) {
                console.error(err.code);
            }

            if(rows.length > 0 && rows[0].ID_rolSistema == 1) user.ID_rolSistema = 1;
            
            else user.ID_rolSistema = 2;
            done(null, user);
        });

    });

});


