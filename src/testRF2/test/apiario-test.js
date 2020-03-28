var chai = require('chai'); 
var assert = chai.assert; 
var should = chai.should(); 
var expect = chai.expect; 
var functions = require('../functions-apiario-test');

describe('Caso de uso RF2.1 - Registrar Apiario: ', function() { 
    describe('RF2.1.1', function(){ 
        it('T1 - Entrada: (1, "A", 1): ',  async () => { 
            result = await functions.insertarApiario(1, "A", 1); 
            assert.equal(result, true); 
        }); 
        it('T2 - Entrada: ("", "",""): ',  async () => { 
            result = await functions.insertarApiario('', '',''); 
            assert.equal(result, false); 
        });
        it('T3 - Entrada: (1,"",1): ',  async () => { 
            result = await functions.insertarApiario(1,'',1); 
            assert.equal(result, true); 
        });  
        it('T4 - Entrada: ("", “A”, 1): ',  async () => { 
            result = await functions.insertarApiario('', 'A', 1); 
            assert.equal(result, false); 
        });  
        it('T5 - Entrada: (1, “A”, “”): ',  async () => { 
            result = await functions.insertarApiario(1, 'A', ''); 
            assert.equal(result, true); 
        });  
        it('T6 - Entrada: (0, “A”, 0): ',  async () => { 
            result = await functions.insertarApiario(0, 'A', 0); 
            assert.equal(result, false); 
        });  
        it('T7 - Entrada: (347, “A”, 1): ',  async () => { 
            result = await functions.insertarApiario(347, 'A', 1); 
            assert.equal(result, false); 
        });  
        it('T8 - Entrada: (1, “(101 caracteres)”, 1): ',  async () => { 
            result = await functions.insertarApiario(1, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 1); 
            assert.equal(result, true); 
        });  
        it('T9 - Entrada: (346, “(100 caracteres)”, (8 digitos)): ',  async () => { 
            result = await functions.insertarApiario(1, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 01234567); 
            assert.equal(result, true); 
        });  
    }); 

    describe('RF2.1.2', function(){ 
        it('T10 - Entrada: ((ID existente), 1): ',  async () => { 
            result = await functions.insertarApiarioTiene(10, 1); 
            assert.equal(result, true); 
        }); 
        it('T11 - Entrada: ((ID existente), 0): ',  async () => { 
            result = await functions.insertarApiarioTiene(10, 0); 
            assert.equal(result, false); 
        }); 
        it('T12 - Entrada: ((ID existente), 4): ',  async () => { 
            result = await functions.insertarApiarioTiene(10, 4); 
            assert.equal(result, false); 
        }); 
        it('T13 - Entrada: ((ID existente), 3): ',  async () => { 
            result = await functions.insertarApiarioTiene(10, 3); 
            assert.equal(result, true); 
        }); 
        it('T14 - Entrada: ((ID no existente), 3): ',  async () => { 
            result = await functions.insertarApiarioTiene(0, 3); 
            assert.equal(result, false); 
        }); 
        it('T15 - Entrada: ("", 3): ',  async () => { 
            result = await functions.insertarApiarioTiene("", 3); 
            assert.equal(result, false); 
        });  
        it('T16 - Entrada: ((ID_existente), ""): ',  async () => { 
            result = await functions.insertarApiarioTiene(10, ""); 
            assert.equal(result, false); 
        });  
        it('T17 - Entrada: ("", ""): ',  async () => { 
            result = await functions.insertarApiarioTiene("", ""); 
            assert.equal(result, false); 
        });                                                                 
    });     
})

describe('Caso de uso RF2.2 - Visualizar Apiarios: ', function() { 
    describe('RF2.1.2', function(){ 
        it('T18 - Entrada: ((ID existente)): ',  async () => { 
            result = await functions.obtenerApiarios(10); 
            assert.equal(result, true); 
        }); 
        it('T19 - Entrada: ((ID no existente)): ',  async () => { 
            result = await functions.obtenerApiarios(0); 
            assert.equal(result, false); 
        }); 
        it('T20 - Entrada: (""): ',  async () => { 
            result = await functions.obtenerApiarios(); 
            assert.equal(result, false); 
        });                                      
    });     
})

describe('Caso de uso RF2.3 - Modificar Apiarios: ', function() { 
    it('T21 - Entrada: (1, "A", 1, Apiario exite): ',  async () => { 
        result = await functions.modificarApiario(1, "A", 1, 10); 
        assert.equal(result, true); 
    }); 
    it('T22 - Entrada: (1, "A", 1, Apiario no existe): ',  async () => { 
        result = await functions.modificarApiario(1, "A", 1, 0); 
        assert.equal(result, false); 
    });  
    it('T23 - Entrada: (1, "A", 1, Apiario nulo): ',  async () => { 
        result = await functions.modificarApiario(1, "A", 1, ""); 
        assert.equal(result, false); 
    });                  
    it('T24 - Entrada: ("", "","", Apiario existe): ',  async () => { 
        result = await functions.modificarApiario('', '','', 10); 
        assert.equal(result, false); 
    });
    it('T25 - Entrada: (1,"",1, Apiario existe): ',  async () => { 
        result = await functions.modificarApiario(1,'',1, 10); 
        assert.equal(result, true); 
    });  
    it('T26 - Entrada: ("", “A”, 1, Apiario existe): ',  async () => { 
        result = await functions.modificarApiario('', 'A', 1, 10); 
        assert.equal(result, false); 
    });  
    it('T27 - Entrada: (1, “A”, “”, Apiario existe): ',  async () => { 
        result = await functions.modificarApiario(1, 'A', '', 10); 
        assert.equal(result, true); 
    });  
    it('T28 - Entrada: (0, “A”, 0, Apiario existe): ',  async () => { 
        result = await functions.modificarApiario(0, 'A', 0, 10); 
        assert.equal(result, false); 
    });  
    it('T29 - Entrada: (347, “A”, 1, Apiario existe): ',  async () => { 
        result = await functions.modificarApiario(347, 'A', 10); 
        assert.equal(result, false); 
    });  
    it('T30 - Entrada: (1, “(101 caracteres)”, 1, Apiario existe): ',  async () => { 
        result = await functions.modificarApiario(1, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 1, 10); 
        assert.equal(result, true); 
    });  
    it('T31 - Entrada: (346, “(100 caracteres)”, (8 digitos), Apiario existe): ',  async () => { 
        result = await functions.modificarApiario(1, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 01234567, 10); 
        assert.equal(result, true); 
    });      
})

describe('Caso de uso RF2.4 - Asignar Apicultor: ', function() { 
    it('T32 - Entrada: ((ID existente), (ID existente), (ID existente)): ',  async () => { 
        result = await functions.asignarApicultor("199065998", 10, 1); 
        assert.equal(result, true); 
    }); 
    it('T33 - Entrada: ((ID no existente), (ID existente), (ID existente)): ',  async () => { 
        result = await functions.asignarApicultor("1", 10, 1); 
        assert.equal(result, false); 
    });     
    it('T34 - Entrada: ((ID existente), (ID no existente), (ID existente)): ',  async () => { 
        result = await functions.asignarApicultor("199065998", -1, 1); 
        assert.equal(result, false); 
    });
    it('T35 - Entrada: ((ID existente), (ID existente), (ID no existente)): ',  async () => { 
        result = await functions.asignarApicultor("199065998", 10, 76); 
        assert.equal(result, false); 
    });      
    it('T36 - Entrada: ("", (ID existente), (ID existente)): ',  async () => { 
        result = await functions.asignarApicultor("", 10, 1); 
        assert.equal(result, false); 
    });     
    it('T37 - Entrada: ((ID existente), "", (ID existente)): ',  async () => { 
        result = await functions.asignarApicultor("199065998", "", 1); 
        assert.equal(result, false); 
    });            
    it('T38 - Entrada: ((ID existente), (ID existente), ""): ',  async () => { 
        result = await functions.asignarApicultor("199065998", 10, ""); 
        assert.equal(result, false); 
    }); 
    it('T39 - Entrada: ("", "", ""): ',  async () => { 
        result = await functions.asignarApicultor("", "", ""); 
        assert.equal(result, false); 
    });                             
})