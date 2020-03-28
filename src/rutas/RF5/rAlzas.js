const express = require('express');
const router = express.Router();

const cAlzas = require('../../controladores/RF5/alzas/cAlzas');
const  { existeColmena } = require('../../lib/RF1/auth');
const { isAdminApiario }  = require('../../lib/RF3/authColmena');

// Renderizado de vistas
router.get('/registrar/:id&:currentPage&:idApiario', existeColmena, isAdminApiario, cAlzas.renderizarIngresarRegistroAlza);

router.get('/listar/:id&:currentPage&:idApiario', existeColmena, cAlzas.renderizarRegistrosAlzas);


// Logica
router.post('/registrar/:id&:currentPage&:idApiario', existeColmena, cAlzas.registrarAlza);


module.exports = router;