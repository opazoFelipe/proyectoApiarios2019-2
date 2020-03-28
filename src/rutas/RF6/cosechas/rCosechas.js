const express = require('express');
const router = express.Router();
const pool = require('../../../database');

const cCosechas = require('../../../controladores/RF6/cosechas/cCosechas');

const { isAdminOrOwnerApiario }  = require('../../../lib/RF2/authApiario');

const { isLoggedIn, isNotLoggedIn, isAdminLoggedIn, isNotAdminLoggedIn } = require('../../../lib/RF1/auth');

//Rutas

router.get('/listar/:id',  isLoggedIn, cCosechas.listarCosechas);
router.post('/listar/:id',  isLoggedIn, cCosechas.listarCosechas);
router.post('/registrar/:id', isLoggedIn, cCosechas.registrarCosecha);
router.post('/modificar/:col/:co', isLoggedIn, cCosechas.modificarCosechas);


//Logica

router.post('/guardarCosecha', cCosechas.guardarCosecha);
router.post('/modificarDatos', cCosechas.modificarDatos);

module.exports = router;