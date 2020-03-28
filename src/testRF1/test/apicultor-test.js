var assert    = require("chai").assert;
var apicultor = require("../funciones-test-apicultor");

describe("Testeo de RF 1.1, RF 1.2 RF 1.3:  ", function () {

    describe("Testeando funcion validarRut: ", () => {

        it("Testeando partición 1.1.1, la funcion deberia retornar False (rut invalido): assert.equal(''): ", () => {
            result = apicultor.validarRut('');
            assert.equal(result, false);
        });

        it("Testeando partición 1.1.2 y 1.7.2 la funcion deberia retornar False (rut invalido): assert.equal('12'): ", () => {
            result = apicultor.validarRut('12');
            assert.equal(result, false);
        });

        it("Testeando partición 1.1.3 y 1.7.3, la funcion deberia retornar False (rut invalido): assert.equal('129'): ", () => {
            result = apicultor.validarRut('129');
            assert.equal(result, false);
        });

        it("Testeando partición 1.1.4 y 1.7.1, la funcion deberia retornar False (rut invalido): assert.equal('18.278.998-7'): ", () => {
            result = apicultor.validarRut('18.278.998-7');
            assert.equal(result, false);
        });

        it("Testeando partición 1.1.5 y 1.7.4, la funcion deberia retornar True (rut valido): assert.equal('1-9'): ", () => {
            result = apicultor.validarRut('1-9');
            assert.equal(result, true);
        });

        it("Testeando partición 1.1.6 y 1.7.5, la funcion deberia retornar True (rut valido): assert.equal('18.686.716-5'): ", () => {
            result = apicultor.validarRut('18.686.716-5');
            assert.equal(result, true);
        });

        it("Testeando partición 1.7.6, la funcion deberia retornar False (rut invalido): assert.equal('asd'): ", () => {
            result = apicultor.validarRut('asd');
            assert.equal(result, false);
        });

    });

    describe("Testeando funcion comprobarRutDuplicado: ", () => {

        it("Testeando partición 1.1.7, la funcion deberia retornar True (rut valido duplicado): assert.equal('18.686.716-5'): ", async () => {
            result = await apicultor.comprobarRutDuplicado('18.686.716-5');
            assert.equal(result, true);
        });

        it("Testeando partición 1.1.8, la funcion deberia retornar False (rut valido no duplicado): assert.equal('12.670.841-6'): ", async () => {
            result = await apicultor.comprobarRutDuplicado('12.670.841-6');
            assert.equal(result, false);
        });

    });

    describe('Testeando funcion validarCorreo: ', () => {

        it("Testeando partición 1.2.1, la funcion deberia retornar False: assert.equal(''): ", () => {
            result = apicultor.validarCorreo('');
            assert.equal(result, false);
        });

        it("Testeando partición 1.2.2, la funcion deberia retornar False: assert.equal('a@a.c'): ", () => {
            result = apicultor.validarCorreo('a@a.c');
            assert.equal(result, false);
        });

        it("Testeando partición 1.2.3, la funcion deberia retornar False: assert.equal('123456'): ", () => {
            result = apicultor.validarCorreo('123456');
            assert.equal(result, false);
        });

        it("Testeando partición 1.2.4, la funcion deberia retornar True: assert.equal('a@a.cl'): ", () => {
            result = apicultor.validarCorreo('a@a.cl');
            assert.equal(result, true);
        });

        it("Testeando partición 1.2.5, la funcion deberia retornar True: assert.equal('felipe.orivas@gmail.com'): ", () => {
            result = apicultor.validarCorreo('felipe@gmail.com');
            assert.equal(result, true);
        });
    });

    describe('Testeando funcion comprobarLargo: ', () => {

        it("Testeando partición 1.3.1, la funcion deberia retornar False: assert.equal(''): ", () => {
            result = apicultor.comprobarLargo('');
            assert.equal(result, false);
        });

        it("Testeando partición 1.3.2, la funcion deberia retornar True: assert.equal('a'): ", () => {
            result = apicultor.comprobarLargo('a');
            assert.equal(result, true);
        });

        it("Testeando partición 1.3.2, la funcion deberia retornar True: assert.equal('Nombre'): ", () => {
            result = apicultor.comprobarLargo('Nombre');
            assert.equal(result, true);
        });

        it("Testeando partición 1.4.1, la funcion deberia retornar False: assert.equal(''): ", () => {
            result = apicultor.comprobarLargo('');
            assert.equal(result, false);
        });

        it("Testeando partición 1.4.2, la funcion deberia retornar True: assert.equal('1'): ", () => {
            result = apicultor.comprobarLargo('1');
            assert.equal(result, true);
        });

        it("Testeando partición 1.4.3, la funcion deberia retornar True: assert.equal('Password'): ", () => {
            result = apicultor.comprobarLargo('Password');
            assert.equal(result, true);
        });
    });

    describe('Testeando funcion validarFiltro: ', () => {

        it("Testeando partición 1.5.1, la funcion deberia retornar False: assert.equal(0):", () => {
            result = apicultor.validarFiltro(0);
            assert.equal(result, false);
        });

        it("Testeando partición 1.5.2, la funcion deberia retornar True: assert.equal(1):", () => {
            result = apicultor.validarFiltro(1);
            assert.equal(result, true);
        });

        it("Testeando partición 1.5.3, la funcion deberia retornar True: assert.equal(2):", () => {
            result = apicultor.validarFiltro(2);
            assert.equal(result, true);
        });

        it("Testeando partición 1.5.4, la funcion deberia retornar False: assert.equal(3):", () => {
            result = apicultor.validarFiltro(3);
            assert.equal(result, false);
        });

        it("Testeando partición 1.5.5, la funcion deberia retornar False: assert.equal(4):", () => {
            result = apicultor.validarFiltro(4);
            assert.equal(result, false);
        });

    });

    describe('Testeando funcion comprobarLargo: ', () => {
        
        it("Testeando partición 1.6.1, la funcion deberia retornar False: assert.equal(''):", () => {
            result = apicultor.comprobarLargo('');
            assert.equal(result, false);
        });

        it("Testeando partición 1.6.2, la funcion deberia retornar True: assert.equal('2020-01-01'):", () => {
            result = apicultor.comprobarLargo('2020-01-01');
            assert.equal(result, true);
        });

    });

});

describe("Testeo de RF 1.4:  ", function () {

    describe("Testeando funcion comprobarRutNoExistente: ", () => {

        it("Testeando partición 1.8.1, la funcion deberia retornar True (rut no existente): assert.equal('12.670.841-6'): ", async () => {
            result = await apicultor.comprobarRutNoExistente('12.670.841-6');
            assert.equal(result, true);
        });

        it("Testeando partición 1.8.2, la funcion deberia retornar False (rut existente): assert.equal('18.686.716-5'): ", async () => {
            result = await apicultor.comprobarRutNoExistente('18.686.716-5');
            assert.equal(result, false);
        });

    });
});

  