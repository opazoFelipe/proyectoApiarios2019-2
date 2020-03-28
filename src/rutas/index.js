const express = require('express');
const router = express.Router();

const random = require('random-number');
const faker = require('faker');

const pool = require('../database');

router.get('/', (req, res) => {
    res.redirect('/registro');
});

router.get('/error', (req, res) => {
    res.send('Usted no tiene permitido acceder a esta ruta');
});

module.exports = router;


// Generar datos falsos para llenar la bd

// Apicultores
router.get('/faker-dataApicultores', async (req, res) => {

    for(let i = 0; i < 100; i++) {
       
        const nuevoApicultor = {};

        nuevoApicultor.id_apicultor = (i+200).toString();
        nuevoApicultor.id_estado = 3;
        nuevoApicultor.correo = faker.internet.email();
        nuevoApicultor.nombre = faker.name.firstName();
        nuevoApicultor.apellido_paterno = faker.name.lastName();
        nuevoApicultor.apellido_materno = faker.name.lastName();
        nuevoApicultor.contrasena = faker.internet.password();
        nuevoApicultor.id_rolSistema = 2;
        // nuevoApicultor.fecha_creacion = default;

        await pool.query('insert into Apicultor set ?', [nuevoApicultor], (err, result) => {

            if(err) {
                console.error(err.code);
                return;
            }

            console.log('apicultor guardado');
            return;
        });
    }

    res.send('listo');

});

//  Apiarios
router.get('/faker-dataApiarios', async (req, res) => {

    for(let i = 0; i < 100; i++) {

        let options = {
            min:  1,
            max:  346,
            integer: true
        }
       
        const nuevoApiario = {};

        nuevoApiario.ID_comuna = await random(options);
        nuevoApiario.Calle = faker.address.streetName();
        nuevoApiario.Numero = await random(options);

        await pool.query('insert into Apiario set ?', [nuevoApiario], (err, result) => {

            if(err) {
                console.error(err.code);
                return;
            }

            console.log('apiario guardado');
            return;
        });
    }

    res.send('listo');

});
