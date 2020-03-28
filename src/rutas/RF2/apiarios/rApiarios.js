const express = require('express');
const router = express.Router();
const pool = require('../../../database');

const cApiarios = require('../../../controladores/RF2/apiarios/cApiarios');

const { isAdminOrOwnerApiario }  = require('../../../lib/RF2/authApiario');

const { isLoggedIn, isNotLoggedIn, isAdminLoggedIn, isNotAdminLoggedIn } = require('../../../lib/RF1/auth');

//Rutas

router.get('/registrar', isLoggedIn, cApiarios.registrarApiario);
router.get('/listar', isLoggedIn, cApiarios.listarApiarios);
router.get('/listarInactivos', isLoggedIn, cApiarios.listarApiariosInactivos);
router.post('/modificar/:id', isAdminOrOwnerApiario, isLoggedIn, cApiarios.modificarApiario);
router.post('/asignarApicultor/:id', isAdminOrOwnerApiario, isLoggedIn, cApiarios.asignarApicultor);
router.post('/listarUsuarios/:id', isAdminOrOwnerApiario, isLoggedIn, cApiarios.listarUsuarios);
router.post('/modificarUsuario/:id/:ap', isLoggedIn, cApiarios.modificarUsuario);


//Logica

router.post('/obtenerComunas/:id', cApiarios.obtenerComunas);
router.post('/registrarApiario', cApiarios.guardarApiario);
router.post('/modificarDatos', cApiarios.modificarDatos);
router.post('/buscarApicultor', cApiarios.buscarApicultor);
router.post('/modificarApicultorRol', cApiarios.modificarApicultorRol);
router.post('/eliminarUsuario/:id/:ap', cApiarios.eliminarUsuario);
router.post('/modificarUsuarioDatos', cApiarios.modificarUsuarioDatos);

module.exports = router;