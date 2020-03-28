const express = require('express');
const router = express.Router();

const cColmenas = require('../../controladores/RF3/colmenas/cColmenas');

const  { existeColmena } = require('../../lib/RF1/auth');
const { isAdminOrOwnerApiario }  = require('../../lib/RF2/authApiario');
const { isAdminApiario }  = require('../../lib/RF3/authColmena');

router.get('/registrar/:idApiario', isAdminApiario, cColmenas.renderizarRegistroColmena);

router.get('/listar/:page&:idApiario', cColmenas.renderizarColmenas);

// router.get('/buscarReina', cColmenas.buscarReina);

router.get('/modificar/:id&:currentPage&:idApiario', existeColmena, isAdminApiario, cColmenas.renderizarModificarColmena);

router.get('/detalles/:id&:currentPage&:idApiario', existeColmena, cColmenas.renderizarDetalleColmena);

router.get('/historialReinas/:id&:currentPage&:idApiario', existeColmena, cColmenas.renderizarHistorialReinas);


router.post('/buscarReina', cColmenas.buscarIdReina);

router.post('/registrarReina', cColmenas.registrarReina);

router.post('/actualizarReina', cColmenas.actualizarReina);

// El id del apiario va en un campo ocultor del formulario de registro
router.post('/registrar', cColmenas.registrarColmena);

router.post('/actualizar/:id&:page&:idApiario', existeColmena, cColmenas.actualizarColmena);

router.post('/buscarApiario', cColmenas.buscarIdApiario);

router.post('/buscarPadreColmena', cColmenas.buscarIdPadre);

module.exports = router;

