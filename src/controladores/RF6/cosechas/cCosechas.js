// Controlador de apicultores

const controlador = {};
const helpers = require('../../../lib/RF1/helpers');
const pool = require('../../../database');

//Listar Cosechas

controlador.listarCosechas = async (req, res, next) => {
    try{
        const { id } = req.params;

        await pool.query('SELECT ApicTi.ID_rol, E.ID_estado FROM Apicultor_tiene ApicTi, Apiario A, Colmena C, Colmena_tiene Colti, Estado E WHERE C.ID_apiario = A.ID_apiario AND A.ID_apiario = ApicTi.ID_apiario AND C.ID_colmena = Colti.ID_colmena AND Colti.ID_estado = E.ID_estado AND C.ID_colmena = ? AND ApicTi.ID_apicultor = ?', [id, req.user.ID_apicultor], async (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al buscar cosechas Error: ' + err.code);
                return;
            }
            const rol = rows;
            console.log(rows);
          
            await pool.query('SELECT C.ID_cosecha, C.ID_colmena, C.Cantidad, M.Simbolo, C.Descripcion, C.Rut_jefe, date_format(C.Fecha, "%d-%m-%Y") as Fecha FROM Cosecha C, Medida M WHERE ID_colmena = ? AND C.ID_medida = M.ID_medida', [id], (err, rows) => {
                if (err) {
                    req.flash('mensajeError', 'Error al buscar cosechas Error: ' + err.code);
                    return;
                }

                res.render('RF6/cosechas/listarCosechas', {
                    cosechas: rows,
                    rol: rol,
                    id: id
                });     
            });                
        });                   
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener cosechas. Error: ' + err.code);
        return false;          
    }
};

//Guardar Cosechas

controlador.registrarCosecha = async (req, res, next) => {
    try{
        const { id } = req.params;
        await pool.query('SELECT * FROM Medida' , async (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al buscar medidas Error: ' + err.code);
                return;
            }
            res.render('RF6/cosechas/registrarCosecha', {
                id: id,
                medidas: rows  
            });                   
        });                    
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener cosechas. Error: ' + e.code);
        return false;          
    }
};

controlador.guardarCosecha = async (req, res) => {
    try{
        const { id_colmena, medida, cantidad, descripcion } = req.body;

        await pool.query('INSERT INTO Cosecha VALUES (default, ?, ?, ?, ?, ?, default);', [id_colmena, medida, cantidad, descripcion, req.user.ID_apicultor], async (err, rows) => {
            if (err) {
                console.error(err.code);
                req.flash('mensajeError', 'Error al registrar cosecha. Error: ' + err.code);
                return false;
            }
            else{
                req.flash('mensajeCorrecto', 'Cosecha registrada correctamente.');
            }
            res.redirect('/cosechas/listar/' + id_colmena);
        });
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return false;        
    }
};

//Modificar Cosechas

controlador.modificarCosechas = async (req, res, next) => {
    try{
        const { col, co  } = req.params;
        await pool.query('SELECT * FROM Medida' , async (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al buscar medidas Error: ' + err.code);
                return;
            }
            const medida = rows;
            await pool.query('SELECT C.ID_cosecha, C.ID_colmena, C.Cantidad, M.Simbolo, C.Descripcion, C.Rut_jefe, date_format(C.Fecha, "%d-%m-%Y") as Fecha FROM Cosecha C, Medida M WHERE C.ID_medida = M.ID_medida AND C.ID_cosecha = ?', [co] , async (err, rows) => {
                if (err) {
                    req.flash('mensajeError', 'Error al buscar medidas Error: ' + err.code);
                    return;
                }           
                res.render('RF6/cosechas/modificarCosecha', {
                    id: col,
                    medidas: medida,
                    cosechas: rows
                }); 
            });                       
        });                    
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener cosechas. Error: ' + e.code);
        return false;          
    }
};

controlador.modificarDatos = async (req, res, next) => {
    try{
        const {id_colmena, id_cosecha, medida, cantidad, descripcion} = req.body;


        await pool.query('UPDATE Cosecha SET ID_medida= ?, Descripcion = ?, Cantidad = ? WHERE ID_cosecha = ?', [medida, descripcion, cantidad, id_cosecha], (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al modificar Cosecha. Error: ' + err.code);
                return;
            }
            else{
                req.flash('mensajeCorrecto', 'Cosecha modificada correctamente.');
            }
            res.redirect(307, '/cosechas/listar/' + id_colmena);
        });       
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener apicultores. Error: ' + err.code);
        return false;          
    }
};

module.exports = controlador;