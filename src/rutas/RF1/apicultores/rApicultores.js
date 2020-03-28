const express = require('express');
const router = express.Router();

const pool = require('../../../database');

const cApicultores = require('../../../controladores/RF1/apicultores/cApicultores');

const { isAdminLoggedIn, existeApicultor } = require('../../../lib/RF1/auth');

router.get('/solicitudes/:page&:fecha', isAdminLoggedIn, cApicultores.renderizarSolicitudes);

router.get('/aceptados/:page&:fecha', isAdminLoggedIn, cApicultores.renderizarAceptados);

router.get('/perfil', cApicultores.renderizarPerfil);

router.get('/datos', cApicultores.renderizarDatos);

router.get('/modificarDatos', cApicultores.renderizarModificarDatos);

router.get('/cambiarPassword', cApicultores.renderizarCambiarPassword);

router.get('/formularioRechazo/:id&:currentPage', isAdminLoggedIn, existeApicultor, cApicultores.renderizarFormularioRechazo);

router.get('/cambiarRol/:id&:currentPage&:fecha', isAdminLoggedIn, cApicultores.renderizarCambiarRol);

// router.post('/eliminarApicultor/:id', controladorUsuarios.eliminarApicultor);


// Logica de negocios
router.post('/aceptar/:id&:currentPage&:fecha', isAdminLoggedIn, existeApicultor, cApicultores.aceptarSolicitud);

router.post('/rechazar/:id', isAdminLoggedIn, cApicultores.rechazarSolicitud);

router.post('/cambiarRol/:id&:page&:fecha', isAdminLoggedIn, cApicultores.cambiarRol);

router.post('/modificarDatos', cApicultores.guardarDatos);

router.post('/cambiarPassword', cApicultores.guardarPassword);


module.exports = router;