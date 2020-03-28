const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../../../lib/RF1/auth');

// Renderizado de vistas
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('RF1/autenticacion/login');
});

router.get('/registro', isNotLoggedIn, (req, res) => {
    res.render('RF1/autenticacion/registro');
});

router.get('/salir', isLoggedIn, (req, res)=>{
    req.logOut();
    res.redirect('/login');
});

// Autenticacion passport
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', {
       successRedirect: '/apicultores/perfil',
       failureRedirect: '/login',
       failureFlash: true
   })(req, res, next);
});

router.post('/registro', isNotLoggedIn, passport.authenticate('local.registro', {
    successRedirect: '/registro',
    failureRedirect: '/registro',
    failureFlash: true
}));

module.exports = router;