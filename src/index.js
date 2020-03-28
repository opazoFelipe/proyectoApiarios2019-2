const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const passport = require('passport');
const morgan = require('morgan');
const path = require('path');

const { database }  = require('./keys');
const { isLoggedIn } = require('./lib/RF1/auth');

const app = express();
require('./lib/RF1/passport');

// Configuracion del servidor
    app.set('port', process.env.PORT || 4000);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

// Middlewares
    app.use(session({
        secret: 'SessionFelipe',
        resave: false, 
        saveUninitialized: false,      
        store: new mysqlStore(database)                          
    }));
    app.use(flash());
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(passport.initialize());
    app.use(passport.session());

// Variables Globales
app.use((req, res, next) => {
    app.locals.mensajeCorrecto = req.flash('mensajeCorrecto');
    app.locals.mensajeError = req.flash('mensajeError');
    app.locals.user = req.user;
    next();
});

global.dataForm = {};

// Rutas
    app.use(require('./rutas'));
    
    // Rutas de RF1 (Registro de apicultores)
    app.use('/apicultores', isLoggedIn, require('./rutas/RF1/apicultores/rApicultores'));
    app.use(require('./rutas/RF1/autenticacion/rAutenticaciones'));

     // Rutas de RF2 (Registro de apiarios)
     app.use('/apiarios', isLoggedIn, require('./rutas/RF2/apiarios/rApiarios'));

    // Rutas de RF3 (Gestionar Colmenas) y RF 4 Gestionar Reina
    app.use('/colmenas', isLoggedIn, require('./rutas/RF3/rColmenas'));
    
    // Rutas de RF5 (Gestionar registros alzas)
    app.use('/colmenas/alzas', require('./rutas/RF5/rAlzas'));

     // Rutas de RF6 (Gestionar Cosechas)
     app.use('/cosechas', isLoggedIn, require('./rutas/RF6/cosechas/rCosechas'));

     // Rutas de RF7 (Gestionar Enfermedades)
     //app.use('/cosechas', isLoggedIn, require('./rutas/RF6/enfermedades/rEnfermedades'));     

// Archivos estaticos
    app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
    app.listen(app.get('port'), (req, res) => {
        console.log('El servidor esta corriendo en el puerto '+app.get('port'));
    });

// asd
