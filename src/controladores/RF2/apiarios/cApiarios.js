// Controlador de apiarios
const controlador = {};
const pool = require('../../../database');
const { promisify } = require('util');  
pool.query = promisify(pool.query);

//Registro de Apiarios

controlador.registrarApiario = async (req, res, next) => {
    try {
        const queryRegion = 'SELECT * FROM Regiones';

        await pool.query(queryRegion, (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
                return;
            }
            res.render('RF2/apiarios/registrarApiario', {
                regiones: rows
            });
        });
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return;        
    }
};

controlador.obtenerComunas = async (req, res) => {
    try{
        const { id } = req.params;

        const query = 'SELECT ID_comuna as id, nombre FROM Comunas WHERE ID_region = ' + id;

        await pool.query(query, (err, rows) => {

            if (err) {
                req.flash('mensajeError', 'Error al obtener comunas. Error: ' + err.code);
                return res.json(err);
            }
            res.json(rows);
        });
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return;        
    }
};

controlador.guardarApiario = async (req, res) => {
        
    const {comuna, calle, numero } = req.body;
        
    const nuevoApiario = {ID_comuna: comuna, Calle: calle, Numero: numero};

    try{
        const result = await pool.query('INSERT INTO Apiario set ?', [nuevoApiario]);
        const idApiarioInsertado = result.insertId;
        
        const nuevoApicultorTiene = {ID_apicultor: req.user.ID_apicultor, ID_rol: 1, ID_apiario: idApiarioInsertado};

        await pool.query('INSERT INTO Apicultor_tiene set ?', [nuevoApicultorTiene]);

        const nuevoApiarioTiene = {ID_estado: 1, ID_apiario: idApiarioInsertado};

        await pool.query('INSERT INTO Apiario_tiene set ?', [nuevoApiarioTiene]);
        req.flash('mensajeCorrecto', 'Apiario registrado correctamente');
        return res.redirect('/apiarios/registrar');
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return false;        
    }
};

//Listar Apiarios

controlador.listarApiarios = async (req, res, next) => {
    await pool.query('SELECT Ap.ID_apiario, Reg.nombre AS Region, Com.nombre AS Comuna, Ap.Calle, Ap.Numero, date_format(Ap.Fecha_creacion, "%d-%m-%Y") as Fecha_creacion, dueno.nombre, dueno.Apellido_materno, dueno.Apellido_paterno, ApicTiene.ID_rol FROM Apiario Ap, Regiones Reg, Comunas Com, Apicultor_tiene ApicTiene, Dueno_apicultor dueno, Rol R WHERE Com.ID_region = Reg.ID_region AND Ap.ID_comuna = Com.ID_comuna AND Ap.ID_apiario = ApicTiene.ID_apiario AND ApicTiene.ID_apicultor = "'+ req.user.ID_apicultor +'" AND ApicTiene.ID_rol = R.ID_rol AND Ap.ID_apiario = dueno.ID_apiario AND Ap.ID_apiario IN (SELECT apti.ID_apiario FROM Apiario_tiene apti, Estado es WHERE apti.ID_estado = es.ID_estado AND es.Descripcion = "Activo") ORDER BY ID_apiario ASC', async (err, rows) => {
        if (err) {
            console.log(err.code);
            req.flash('mensajeError', 'Error al obtener lista de apiarios. Error: ' + err.code);
            return;
        }
        apiariosActivos = rows;
        console.log(rows);
        res.render('RF2/apiarios/listarApiarios', {
            apiariosActivos: apiariosActivos,
            apiariosInactivos: rows,
        });
    });
};

controlador.listarApiariosInactivos = async (req, res, next) => {
    await pool.query('SELECT Ap.ID_apiario, Reg.nombre AS Region, Com.nombre AS Comuna, Ap.Calle, Ap.Numero, date_format(Ap.Fecha_creacion, "%d-%m-%Y") as Fecha_creacion, date_format(ApicTiene.Fecha, "%d-%m-%Y") as Fecha_inactividad, dueno.nombre, dueno.Apellido_materno, dueno.Apellido_paterno, ApicTiene.ID_rol FROM Apiario Ap, Regiones Reg, Comunas Com, Apicultor_tiene ApicTiene, Dueno_apicultor dueno, Rol R WHERE Com.ID_region = Reg.ID_region AND Ap.ID_comuna = Com.ID_comuna AND Ap.ID_apiario = ApicTiene.ID_apiario AND ApicTiene.ID_apicultor = "'+ req.user.ID_apicultor +'" AND ApicTiene.ID_rol = R.ID_rol AND Ap.ID_apiario = dueno.ID_apiario AND Ap.ID_apiario IN (SELECT apti.ID_apiario FROM Apiario_tiene apti, Estado es WHERE apti.ID_estado = es.ID_estado AND es.Descripcion = "Inactivo") ORDER BY ID_apiario ASC', async (err, rows) => {
        if (err) {
            req.flash('mensajeError', 'Error al obtener lista de apiarios. Error: ' + err.code);
            return;
        }
        apiariosActivos = rows;
        res.render('RF2/apiarios/listarApiariosInactivos', {
            apiariosActivos: apiariosActivos,
            apiariosInactivos: rows,
        });
    });
};

//Modificar Apiarios

controlador.modificarApiario = async (req, res, next) => {
    const { id } = req.params;
    try{
        await pool.query('SELECT * FROM Regiones', async (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
            }
            const regiones = rows;
            await pool.query('SELECT * FROM Apiario A, Apiario_tiene At WHERE A.ID_apiario = ? AND A.ID_apiario = At.ID_apiario', [id], async (err, rows) => {
                if (err) {
                    req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
                    return rows;
                }
                const datosApiario = rows;
                await pool.query('SELECT * FROM Comunas WHERE ID_region = (SELECT ID_region FROM Comunas WHERE ID_comuna = ?);', [datosApiario[0].ID_comuna], async (err, rows) => {
                    if (err) {
                        req.flash('mensajeError', 'Error al obtener datos de Apiario. Error: ' + err.code);
                        return rows;
                    }
                    const comunas = rows;
                    await pool.query('SELECT * FROM Estado', async (err, rows) => {
                        if (err) {
                            req.flash('mensajeError', 'Error al obtener estados. Error: ' + err.code);
                            return rows;
                        }
                        const estados = rows;
                        await pool.query('SELECT ID_region FROM Comunas WHERE ID_comuna = ?', [datosApiario[0].ID_comuna], async (err, rows) => {
                            if (err) {
                                req.flash('mensajeError', 'Error al obtener estados. Error: ' + err.code);
                                return rows;
                            }
                            res.render('RF2/apiarios/modificarApiarios', {
                                regiones: regiones,
                                comunas: comunas,
                                apiarios: datosApiario,
                                estados: estados,
                                regionApiario: rows
                            });
                        });     
                    });                       
                });   
            });   
        });    
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return false;          
    }
};


controlador.modificarDatos = async (req, res) => {
    try{
        const { region, comuna, calle, numero, id_apiario, estado} = req.body;

        await pool.query('UPDATE Apiario SET ID_comuna = ?, Calle = ?, Numero = ? WHERE ID_apiario = ?', [comuna, calle, numero, id_apiario], async (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al modificar apiario. Error: ' + err.code);
                return false;
            }
            console.log(rows);
            await pool.query('UPDATE Apiario_tiene SET ID_estado = ? WHERE ID_apiario = ?', [estado, id_apiario] , async (err, rows) => {
                if (err) {
                    req.flash('mensajeError', 'Error al modificar apiario_tiene. Error: ' + err.code);
                    return false;
                }
                req.flash('mensajeCorrecto', 'Apiario modificado correctamente.');
                res.redirect('/apiarios/listar');
                return true;           
            });
        });
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return false;        
    }
};

//Asignar Apicultor

controlador.asignarApicultor = async (req, res, next) => {
    try{
        const { id } = req.params;
         res.render('RF2/apiarios/asociarApicultor', {
            id: id
        });
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return false;          
    }
};

controlador.buscarApicultor = async (req, res) => {
    try{
        const {ID_apiario, ID_apicultor} = req.body;
        response = {};

        await pool.query('SELECT ID_apicultor FROM Apicultor WHERE ID_apicultor = ?', [ID_apicultor], async (err, rows) => {
            if (err) {
                response.result = false;
                response.message = "Error al buscar apicultor.";
                res.json(response);
            }
            if (rows.length < 1) {
                response.result = false;
                response.message = "El apicultor buscado no existe.";
                res.json(response);
            }
            await pool.query('SELECT ID_apicultor FROM Apicultor_tiene WHERE ID_apicultor = ? AND ID_apiario = ?', [ID_apicultor, ID_apiario], async (err, rows) => {
                if (err) {
                    response.result = false;
                    response.message = "Error al buscar asociación de Apicultor con Apiario.";
                    res.json(response);
                }
                if (rows.length >= 1){
                    response.result = false;
                    response.message = "El apicultor ya tiene un rol en este apiario.";
                    res.json(response);             
                }
                else{
                    response.result = true;
                    response.message = "Apicultor disponible.";
                    res.json(response);
                }
            });
        });
    }
    catch (e){
        req.flash('mensajeError', 'Error al buscar apicultor. Error: ' + e.code);
        return false;         
    } 
};

controlador.modificarApicultorRol = async (req, res, next) => {
    try{
        const {apicultor, apiario, roles} = req.body;
    
        await pool.query('INSERT INTO Apicultor_tiene VALUES (?, ?, ?, now())', [apicultor, roles, apiario], (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
                return;
            }
            if (rows.affectedRows > 0) req.flash('mensajeCorrecto', 'Rol asignado correctamente.');
            res.redirect(307, '/apiarios/listarUsuarios/' + apiario);
        });
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener regiones. Error: ' + err.code);
        return false;          
    }
};

//Listar Usuarios

controlador.listarUsuarios = async (req, res, next) => {
    try{
        const { id } = req.params;
        await pool.query('SELECT ApicTi.ID_apicultor, A.Nombre, A.Apellido_paterno, A.Apellido_materno, R.Descripcion, R.ID_rol, date_format(ApicTi.Fecha, "%d-%m-%Y") as Fecha FROM Apicultor_tiene ApicTi, Apicultor A, Rol R WHERE ApicTi.ID_apicultor = A.ID_apicultor AND ApicTi.ID_rol = R.ID_rol AND ApicTi.ID_apiario = ? ORDER BY R.ID_rol ASC', [id], (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al obtener apicultores. Error: ' + err.code);
                return;
            }
            res.render('RF2/apiarios/listarUsuarios', {
                id: id,
                usuarios: rows
            });
        });       
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener apicultores. Error: ' + err.code);
        return false;          
    }
};

//Eliminar Apicultor

controlador.eliminarUsuario = async (req, res, next) => {
    try{
        const { id, ap } = req.params;
        await pool.query('DELETE FROM Apicultor_tiene WHERE ID_apicultor = ? AND ID_apiario = ?', [id, ap], (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al eliminar apicultor. Error: ' + err.code);
                return;
            }
            else{
                req.flash('mensajeCorrecto', 'Apicultor eliminado de apiario.');
            }
            res.redirect(307, '/apiarios/listarUsuarios/' + ap);
        });       
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener apicultores. Error: ' + err.code);
        return false;          
    }
};

//Modificar Apicultores

controlador.modificarUsuario = async (req, res, next) => {
    try{
        const { id, ap } = req.params;
        await pool.query('SELECT ID_rol FROM Apicultor_tiene WHERE ID_apicultor = ? AND ID_apiario = ?', [id, ap], (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al eliminar apicultor. Error: ' + err.code);
                return;
            }
            res.render('RF2/apiarios/modificarApicultor', {
                ID_apicultor: id,
                ID_apiario: ap,
                dataApicultor: rows
            });     
        });              
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener apicultores. Error: ' + err.code);
        return false;          
    }
};

//Modificar Apicultores

controlador.modificarUsuarioDatos = async (req, res, next) => {
    try{
        const {apicultor, apiario, roles} = req.body;

        await pool.query('UPDATE Apicultor_tiene SET ID_rol = ? WHERE ID_apiario = ? AND ID_apicultor = ?', [roles, apiario, apicultor], (err, rows) => {
            if (err) {
                req.flash('mensajeError', 'Error al modificar Apicultor. Error: ' + err.code);
                return;
            }
            else{
                req.flash('mensajeCorrecto', 'Apicultor modificado correctamente.');
            }
            res.redirect(307, '/apiarios/listarUsuarios/' + apiario);
        });       
    }
    catch (e){
        req.flash('mensajeError', 'Error al obtener apicultores. Error: ' + err.code);
        return false;          
    }
};


module.exports = controlador;
