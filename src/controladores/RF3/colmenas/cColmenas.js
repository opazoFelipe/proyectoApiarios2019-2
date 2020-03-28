const controlador = {};
const pool = require('../../../database');

const { promisify } = require('util');

pool.query = promisify(pool.query);

// Renderizado de vistas


// Colmenas
controlador.renderizarRegistroColmena = async (req, res) => {

    // Se require el ID del Apiario en el cual se registrara la nueva colmena
    const { idApiario } = req.params;
    const dataView = {};

    // En el ultimo callback renderizar la vista, callbacks hell :´v

    await pool.query('select * from Reina', async (err, rows) => {

        if (err) return console.error(err.code + ' | query: Reina');
        dataView.reinas = rows;
        
        await pool.query('select * from Estado where ID_estado < 3', async (err, rows) => {

            if (err) return console.error(err.code + ' | query: Estado');
            dataView.estados = rows;

            await pool.query('select * from Origen_colmena', async (err, rows) => {
                if (err) return console.error(err.code + ' | query: Origen_colmena');
                dataView.origenesColmenas = rows;

                await pool.query('select * from Colmena', async (err, rows) => {
                    if (err) return console.error(err.code + ' | query: Colmena');
                    dataView.colmenas = rows;

                    await pool.query('select * from Tipo_alza', async(err, rows) => {
                        if (err) return console.error(err.code + ' | query: Tipo_alza');
                        dataView.tiposAlzas = rows;

                        await pool.query('select count(*) as Cantidad from Colmena', (err, rows) => {
                            if (err) return console.error(err.code + ' | query: genera');
                            
                            if(rows[0].Cantidad == 0) {
                                dataView.origenesColmenas.pop();
                                dataView.primeraColmena = true;
                            }

                            res.render('RF3/colmenas/registrarColmena', {dataView, idApiario});
                        });           
                    });
                    
                });

            });

        });

    });
};

async function actualizarEstadoColmenas(idApiario) {

    const col = await pool.query('select ID_colmena from Colmena where ID_apiario = ?', [idApiario]);
    const lenCol = col.length;
    for(let i = 0; i < lenCol; i++) {
        let r1 = await pool.query('update Colmena_tiene set ID_estado = 2 where ID_colmena = ?', [col[i].ID_colmena]);
        if(i == lenCol - 1) return true;
    }

}

controlador.renderizarColmenas = async (req, res) => {

    // Definir la paginacion
    let perPage = 6;
    let { page, idApiario } = req.params || 1;
    let skip = ( page * perPage ) - perPage;
    let numPages;

    const idApicultor = req.user.ID_apicultor.toString();
    const sqlCrendencialesApiario = `
        select 
            ID_rol
        from
            Apicultor_tiene
        where 
            ID_apicultor = ? and ID_apiario = ?;
    `;

    let isLector = false;

    try {

        const credenciales = await pool.query(sqlCrendencialesApiario, [idApicultor, idApiario]);
        if(credenciales[0].ID_rol == 3) isLector = true;

    } catch (error) {
        console.error('Error al validar credenciales de acceso al Apiario: ' + error);
        req.flash('mensajeError', 'Error al validar credenciales de acceso al Apiario');
        return res.redirect('/apicultores/perfil');
    }

    let isInactiveApiario = false;
    const resultEstado = await pool.query('select ID_estado from Apiario_tiene where ID_apiario = ?', [idApiario]);
    if(resultEstado[0].ID_estado == 2)  {
        isInactiveApiario = true;
        const rCol = await actualizarEstadoColmenas(idApiario);
    }

    const sqlContarColmenas = `
        select 
            count(*) as cantidad_colmenas
        from 
            Colmena c 
        inner join 
            Apiario a on c.ID_apiario = a.ID_apiario
        inner join 
            Apicultor_tiene at on a.ID_apiario = at.ID_apiario 
        where 
            at.ID_apicultor = ? and c.ID_apiario = ?;
    `;

    await pool.query(sqlContarColmenas, [idApicultor, idApiario], async (err, rows) => {
        
        if(err) {
            console.error('error al obtener la cuenta de las colmenas que tiene el apicultor logeado: '+err.code);
            res.send('Error al obtener colmenas: ' + err.code);
        }

        numPages = Math.ceil( rows[0].cantidad_colmenas / perPage );

        const sqlObtenerDatosColmenas = `
        select distinct
            x.ID_colmena, x.ID_apiario, r.raza as Raza, oc.ID_origen, oc.Descripcion as Descripcion_origen, x.ID_padre as ID_colmena_padre, e.Descripcion as Estado, date_format(x.Fecha_creacion, "%d-%m-%Y") as Fecha_creacion
        from
            (select c2.ID_colmena, c2.ID_origen, g2.ID_padre, c2.ID_reina, c2.ID_apiario, c2.Fecha_creacion from Colmena c2 left outer join Genera g2 on c2.ID_colmena = g2.ID_hijo) as x 
        inner join 
            Origen_colmena oc on x.ID_origen = oc.ID_origen 
        inner join 
            Colmena_tiene ct on x.ID_colmena = ct.ID_colmena 
        inner join
            Estado e on ct.ID_estado = e.ID_estado 
        inner join	
            Reina r on r.ID_reina = x.ID_reina
        inner join
            Apicultor_tiene at on x.ID_apiario = at.ID_apiario
        where 
            at.ID_apicultor = ? and x.ID_apiario = ?

        order by x.ID_colmena limit ? offset ?;
        `;

        await pool.query(sqlObtenerDatosColmenas, [idApicultor, idApiario, perPage, skip], (err, rows) => {
            
            if(err) {
                console.error(err.code);
                res.send('error al listar colmenas: '+err.code);   
            } 

            const data = rows;

            res.render('RF3/colmenas/listarColmenas', {
                data,
                current: page,
                pages: numPages,
                perPage,
                idApiario,
                isLector,
                isInactiveApiario
            });
    
        });
    });
};

controlador.renderizarModificarColmena = async (req, res) => {

    const { id, currentPage, idApiario } = req.params;

    let isInactiveColmena = false;
    const estadoCol = await pool.query('select ID_estado from Colmena_tiene where ID_colmena = ?', [id]);
    if(estadoCol[0].ID_estado != 1) isInactiveColmena = true;

    const dataView = {};

    const sql1 = `
        select 
            c.ID_colmena, c.ID_apiario, c.ID_reina, c.ID_origen, c.Fecha_creacion, r.Raza, g.ID_padre, ct.ID_estado, ra.ID_tipoAlza, ra.cantidad as cantidad_alza
        from
            Colmena c
        left outer join
            Genera g on c.ID_colmena = g.ID_hijo
        inner join 
            Reina r on c.ID_reina = r.ID_reina
        inner join
            Colmena_tiene ct on c.ID_colmena = ct.ID_colmena
        inner join
            Registro_alza ra on c.ID_colmena = ra.ID_colmena
        where 
            c.ID_colmena = ? and ra.ID_accion = 1;
        `;

    // En el ultimo callback renderizar la vista, callbacks hell :´v

    await pool.query(sql1, [id], async (err, rows) => {

        if (err) return console.error(err.code + ' | query: Reina');
        dataView.colmena = rows[0];

        await pool.query('select * from Estado where ID_estado < 3', async (err, rows) => {

            if (err) return console.error(err.code + ' | query: Estado');
            dataView.estados = rows;

            await pool.query('select * from Origen_colmena', async (err, rows) => {
                if (err) return console.error(err.code + ' | query: Origen_colmena');
                dataView.origenesColmenas = rows;

                await pool.query('select * from Tipo_alza', (err, rows) => {
                    if (err) return console.error(err.code + ' | query: Tipo_alza');
                    dataView.tiposAlzas = rows;
                    res.render('RF3/colmenas/modificarColmena', { dataView, currentPage, idApiario, isInactiveColmena });
                });

            });

        });

    });
};

controlador.renderizarDetalleColmena = async (req, res) => {

    const idColmena = req.params.id;
    const currentPage = req.params.currentPage;
    const idApiario = req.params.idApiario;

    const idApicultor = req.user.ID_apicultor.toString();
    const sqlCrendencialesApiario = `
        select 
            ID_rol
        from
            Apicultor_tiene
        where 
            ID_apicultor = ? and ID_apiario = ?;
    `;

    let isLector = false;
    let isInactiveApiario = false;
    let isInactiveColmena = false;

    try {

        const credenciales = await pool.query(sqlCrendencialesApiario, [idApicultor, idApiario]);
        if(credenciales[0].ID_rol == 3) isLector = true;

        
        const resultEstado = await pool.query('select ID_estado from Apiario_tiene where ID_apiario = ?', [idApiario]);
        if(resultEstado[0].ID_estado == 2) isInactiveApiario = true;

        const estadoCol = await pool.query('select ID_estado from Colmena_tiene where ID_colmena = ?', [idColmena]);
        if(estadoCol[0].ID_estado != 1) isInactiveColmena = true;

    } catch (error) {
        console.error('Error al validar credenciales de acceso al Apiario: ' + error);
        req.flash('mensajeError', 'Error al validar credenciales de acceso al Apiario');
        return res.redirect('/colmenas/listar/1&' + idApiario);
    }

    const detalleColmena = {};

    const sqlColmena = 'select * from Colmena where ID_colmena = ?';
    const sqlAlzasColmena = 'select * from Registro_alza where ID_colmena = ?'

    // En primer lugar, obtener las alzas de la colmena
        // obtener primero el alza inicial para hacer calcular las alzas actuales
        const sqlAlzaInicial= "select * from Registro_alza where ID_accion = 1 and ID_colmena = ?";
    await pool.query(sqlAlzaInicial, [idColmena], async (err, rows) => {
        if(err) {
            return console.error("Error al obtener el alza inicial: " + err.code);
        }

        let alzaInicial = 0;
        if(rows[0].ID_tipoAlza == 1) {
            alzaInicial = (rows[0].Cantidad * 2);
        } else 
            alzaInicial = rows[0].Cantidad;
        
       
        // Obtener la suma de las alzas que se han sacado de la colmena
        const sqlAlzasSacadas = "select * from Registro_alza where ID_accion = 3 and ID_colmena = ?";
        await pool.query(sqlAlzasSacadas, [idColmena], async (err, rows) => {
            if(err) {
                return console.error("Error al obtener el alzas sacadas: " + err.code);
            }
            let sumaMediaAlzasSacadas = 0; //en media alzas
            const alzasSacadas = rows;
            if(rows.length > 0) {
                alzasSacadas.forEach(ma => {
                    if(ma.ID_tipoAlza == 1) sumaMediaAlzasSacadas += (ma.Cantidad*2);
                    if(ma.ID_tipoAlza == 2) sumaMediaAlzasSacadas += ma.Cantidad;
                });
            } else sumaMediaAlzasSacadas = 0;

            // Obtener la suma de las alzas que se han agregado a la colmena
            const sqlAlzasAgregadas = "select * from Registro_alza where ID_accion = 2 and ID_colmena = ?";
            await pool.query(sqlAlzasAgregadas, [idColmena], async (err, rows) => {
                if(err) {
                    return console.error("Error al obtener el alzas agregadas: " + err.code);
                }
                let sumaMediaAlzasAgregadas = 0; //en media alzas
                const alzasAgregadas = rows;
                if(rows.length > 0) {
                alzasAgregadas.forEach(ma => {
                    if(ma.ID_tipoAlza == 1) sumaMediaAlzasAgregadas += (ma.Cantidad*2);
                    if(ma.ID_tipoAlza == 2) sumaMediaAlzasAgregadas += ma.Cantidad;
                });
                } else sumaMediaAlzasAgregadas = 0;

                // Obtener la cantidad de alzas actuales
                detalleColmena.mediasAlzasTotales = ((alzaInicial + sumaMediaAlzasAgregadas) - sumaMediaAlzasSacadas);

                // Obtener las colmenas generadas
                const sqlColmenasHijas = 'select Count(*) as cantidad_hijas from Genera where ID_padre = ?';
                await pool.query(sqlColmenasHijas, [idColmena], async (err, rows) => {
                    if(err) {
                        return console.error("Error al obtener colmenas hijas: " + err.code);
                    }
                    detalleColmena.cantidadHijas = rows[0].cantidad_hijas;
                    
                    // Obtener detalles mas generales
                    const slqDetallesGenerales = `
                        select
                            c.*, r.Raza, r.Descripcion as Descripcion_reina, oc.Descripcion as Origen, g.ID_padre, a.Calle, a.Numero, com.Nombre as Comuna, reg.Nombre as Region, date_format(c.Fecha_creacion, "%d-%m-%Y") as Fecha_creacion_colmena, e.Descripcion as Estado
                        from
                            Colmena c
                        inner join
                            Apiario a on c.ID_apiario = a.ID_apiario
                        inner join
                            Colmena_tiene ct on ct.ID_colmena = c.ID_colmena
                        inner join
                            Estado e on e.ID_estado = ct.ID_estado
                        inner join
                            Reina r on r.ID_reina = c.ID_reina
                        left outer join
                            Genera g on g.ID_hijo = c.ID_colmena
                        inner join
                            Origen_colmena oc on oc.ID_origen = c.ID_origen
                        inner join 
                            Comunas com on com.ID_comuna = a.ID_comuna
                        inner join 
                            Regiones reg on reg.ID_region = com.ID_region
                        where 
                            c.Id_colmena = ?;
                    `;

                    await pool.query(slqDetallesGenerales, [idColmena], async (err, rows) => {
                        if(err) {
                            return console.error("Error al obtener detalles generales de la colmena: " + err.code);
                        }
                        detalleColmena.general = rows[0];

                        await pool.query('select * from Cambia_reina where ID_reina_antigua = ? and ID_colmena = ?', [rows[0].ID_reina, idColmena], (err, rows) => {
                            if(err) {
                                return console.error("Error al obtener respuesta sobre si esta colmena ha cambiado su reina: " + err.code);
                            }
                            if(rows.length < 1) {
                                detalleColmena.tieneHistorial = false;
                            } else {
                                detalleColmena.tieneHistorial = true;
                            }

                            res.render('RF3/colmenas/detalles', {
                                detalleColmena,
                                currentPage,
                                idApiario,
                                isLector,
                                isInactiveApiario,
                                isInactiveColmena
                            });
                        });
                    });

                });
            });
        });
    });
};

controlador.renderizarHistorialReinas = async (req, res) => {

    // Se recibe el ID de colmena : id
    const { id, currentPage, idApiario } = req.params;
    const historialReinas = {};

    const sqlHistorialReinas = `
        select 
            c.ID_cambio, c.ID_reina_antigua, c.Motivo, date_format(c.Fecha_creacion, "%d-%m-%Y") as fecha_creacion, r.Raza
        from 
            Cambia_reina c
        left outer join
            Reina r on c.ID_reina_antigua = r.ID_reina
        where
            c.ID_colmena = ?
        order by 
            c.fecha_creacion DESC
    `;

    await pool.query(sqlHistorialReinas, [id], async (err, rows) => {

        if(err) {
            return console.error("Error al obtener historial: " + err.code);
        }

        if(rows.length < 1) {
            historialReinas.tieneHistorial = false;
            req.flash('mensajeCorrecto', 'No existe historial de Reinas');
            return res.redirect('/colmenas/detalles/' + id + '&' + currentPage + '&' + idApiario);
        } else {

            historialReinas.tieneHistorial = true;
            historialReinas.antiguas = rows;
 
        }

        const sqlReinaActual = `
            select 
                r.ID_reina, r.Raza, r.Descripcion, date_format(c.Fecha_creacion, "%d-%m-%Y") as Fecha_creacion
            from
                Colmena c
            inner join
                Reina r on c.ID_reina = r.ID_reina
            where ID_colmena = ?
        `;
        
        await pool.query(sqlReinaActual, [id], (err, rows) => {

            if(err) {
                return console.error("Error al obtener Reina Actual: " + err.code);
            }

            historialReinas.actual = rows[0];

            // Si el id de la reina actual es igual al id de la primera reina antigua obtenida, significa que la reina actual no es la primera reina de esta colmena
            // . Por lo tanto la ultima reina antigua obtenido fue la primera reina de la colmena
   
            res.render('RF3/colmenas/historialReinas', {
                historialReinas,
                idColmena: id,
                currentPage,
                idApiario
            });
        });

    });

};

// controlador.buscarReina = async (req, res) => {
//     res.render('RF3/colmenas/buscarReina');
// };


// logica 

// Colmenas
controlador.registrarColmena = async (req, res) => {

    // Se requiere el ID del apiario (el cual a su vez pertenece al usuario logeado) para el cual se esta registrando la colmena, viene del RF2,
    // se usara un apiario test ingresado por consola a mysql
  
    if(dataForm.dataTemp) delete dataForm.dataTemp;

    const { selectOrigen, inputColmenaOrigen, idReinaHidden, selectTipoAlza, selectCantidadAlza, selectEstado, idApiario } = req.body;

    const dataTemp = {};

    dataTemp.idReina = idReinaHidden;
    dataTemp.ID_tipoAlza = selectTipoAlza;
    dataTemp.cantidadAlza = selectCantidadAlza;
    dataTemp.ID_estado = selectEstado;
    dataTemp.ID_origen = selectOrigen;
    dataTemp.ID_padre = inputColmenaOrigen;

    if(selectOrigen == 3) {

        if(inputColmenaOrigen.length < 1 | isNaN(inputColmenaOrigen)) {
            req.flash('mensajeError', 'Ingrese el ID (Número) de la Colmena que ha Originado esta Nueva Colmena a Registrar');
            return res.redirect('/colmenas/registrar/' + idApiario);
        }

        const resultPadre = await pool.query('select ID_estado from Colmena_tiene where ID_colmena = ?', [inputColmenaOrigen]);
        if(resultPadre[0].ID_estado != 1) {
            console.log('oa');
            req.flash('mensajeError', 'El ID de Colmena Padre ingresado esta inactivo, Ingrese un ID de Colmena Activa');
            return res.redirect('/colmenas/registrar/' + idApiario);
        }
    }

    if(idReinaHidden.length < 1 | isNaN(idReinaHidden)) {
        req.flash('mensajeError', 'Ingrese la raza de la Colmena (Ingresando el ID de la Reina)');
        res.redirect('/colmenas/registrar');
    }

    const nuevaColmena = {
        // ID_colmena es creado por defecto
        ID_apiario: parseInt(idApiario),
        ID_reina: parseInt(idReinaHidden),
        ID_origen: parseInt(selectOrigen),
        // Fecha_creacion es creado por defecto
    };


    await pool.query('insert into Colmena set ? ', [nuevaColmena], async (err, result) => {

        if(err) {
            req.flash('mensajeError', 'Error al guardar colmena: ' + err.code);
            res.redirect('/colmenas/registrar/' + idApiario);
        }

        idColmenaInsertado = result.insertId;

        const nuevaColmenaTiene = {
            ID_estado: selectEstado,
            ID_colmena: idColmenaInsertado
            // Fecha se crea por defecto al insertar
        };

       await pool.query('insert into Colmena_tiene set ?', [nuevaColmenaTiene], async (err, result) => {
            
            if(err) {
                req.flash('mensajeError', 'Error al guardar estado de la colmena: ' + err.code);
                res.redirect('/colmenas/registrar/' + idApiario);
            }

            const nuevoRegistroAlza = {
                ID_colmena: idColmenaInsertado,
                ID_tipoAlza: selectTipoAlza,
                Cantidad: selectCantidadAlza,
                ID_accion: 1
            };

            await pool.query('insert into Registro_alza set ?', [nuevoRegistroAlza], async (err, result) => {

                if(err) {
                    req.flash('mensajeError', 'Error al guardar registro de alza inicial de la colmena: ' + err.code);
                    res.redirect('/colmenas/registrar/' + idApiario);
                }

                if(selectOrigen == 3) {

                    const nuevoOrigenColmena = {
                        ID_padre: inputColmenaOrigen,
                        ID_hijo: idColmenaInsertado
                    };
    
                    await pool.query('insert into Genera set ?', [nuevoOrigenColmena], (err, result) => {
    
                        if(err) {
                            req.flash('mensajeError', 'Error al insertar el origen de la colmena: ' + err.code);
                            res.redirect('/colmenas/registrar/'+idApiario);
                        }
    
                        req.flash('mensajeCorrecto', 'Colmena registrada correctamente');
                        res.redirect('/colmenas/listar/1&' + idApiario);
    
                    });
                } else {
                    req.flash('mensajeCorrecto', 'Colmena registrada correctamente, id Obtenido: ' + idColmenaInsertado);
                    res.redirect('/colmenas/listar/1&' + idApiario);
                }
            });
       });
    });
};

controlador.actualizarColmena = async (req, res) => {

    const idColmena = req.params.id;
    const currentPage = req.params.page;
    const idApiario = req.params.idApiario;

    let isInactiveColmena = false;
    const estadoCol = await pool.query('select ID_estado from Colmena_tiene where ID_colmena = ?', [idColmena]);
    if (estadoCol[0].ID_estado != 1) {
       
        try {

            await pool.query('update Colmena_tiene set ID_estado = ? where ID_colmena = ?', [req.body.selectEstado, idColmena]);
            req.flash('mensajeCorrecto', 'Colmena actualizada correctamente');
            return res.redirect('/colmenas/listar/' + currentPage + '&' + idApiario);

        } catch (error) {

            req.flash('mensajeError', 'Ha habido un error interno, intente mas tarde');
            return res.redirect('/colmenas/modificar/' + idColmena + '&' + currentPage + '&' + idApiario);
        }
        
    } else {

        const nuevaColmena = {
            ID_apiario: req.body.idApiarioHidden,
            ID_origen: req.body.selectOrigen,
            ID_reina: req.body.idReinaHidden,
            ID_estado: req.body.selectEstado,
            ID_tipoAlza: req.body.selectTipoAlza,
            cantidad_alza: req.body.selectCantidadAlza
        };

        const sqlTipoAlza = 'update Registro_alza set ID_tipoAlza = ?, cantidad = ? where ID_colmena = ? and ID_accion = 1';
        const sqlEstado = 'update Colmena_tiene set ID_estado = ? where ID_colmena = ?';

        try {

            const result1 = await pool.query(sqlTipoAlza, [nuevaColmena.ID_tipoAlza, nuevaColmena.cantidad_alza, idColmena]);
            const result2 = await pool.query(sqlEstado, [nuevaColmena.ID_estado, idColmena]);
            const rows1 = await pool.query('select * from Colmena where ID_colmena = ?', [idColmena]);
            const colmenaOriginal = rows1[0];

            if (colmenaOriginal.ID_reina != nuevaColmena.ID_reina) {

                const nuevoCambioReina = {
                    ID_reina_antigua: colmenaOriginal.ID_reina,
                    ID_colmena: idColmena,
                    Motivo: req.body.motivoCambioReina
                };

                // Registrar el cambio de reina
                sqlCambioReina = 'insert into Cambia_reina set ?';
                const result3 = await pool.query(sqlCambioReina, [nuevoCambioReina]);

                // Pasar el estado de la reina sustituida a inactiva
                sqlEstadoReina = 'update Reina_tiene set ID_Estado = 2 where ID_reina = ?'
                const result4 = await pool.query(sqlEstadoReina, [colmenaOriginal.ID_reina]);

            }

            if (nuevaColmena.ID_origen != 3) {

                const sqlEliminarGenera = 'delete from Genera where ID_hijo = ?';
                const result5 = await pool.query(sqlEliminarGenera, [idColmena]);

            }

            if (req.body.inputColmenaOrigen == idColmena) {
                req.flash('mensajeError', 'El ID de Colmena Padre debe ser distinto al ID de Colmena');
                return res.redirect('/colmenas/modificar/' + idColmena + '&' + currentPage + '&' + idApiario);
            }

            if (nuevaColmena.ID_origen == 3) {

                const nuevoOrigen = {
                    ID_padre: req.body.inputColmenaOrigen,
                    ID_hijo: idColmena
                };

                const rows2 = await pool.query('select * from Genera where ID_hijo = ?', [idColmena]);

                if (rows2.length > 0) {

                    const sqlUpdateGenera = 'update Genera set ? where ID_hijo = ?';
                    const result6 = await pool.query(sqlUpdateGenera, [nuevoOrigen, idColmena]);
                }
                if (rows2.length < 1) {

                    const sqlInsertGenera = 'insert into Genera set ?';
                    const result7 = await pool.query(sqlInsertGenera, [nuevoOrigen]);

                }
            }

            const datosNuevaColmena = {
                ID_apiario: req.body.idApiarioHidden,
                ID_origen: req.body.selectOrigen,
                ID_reina: req.body.idReinaHidden
            };

            const sqlActualizarColmena = 'update Colmena set ? where ID_colmena = ?';

            req.flash('mensajeCorrecto', 'Colmena actualizada correctamente');
            const finalResult = await pool.query(sqlActualizarColmena, [datosNuevaColmena, idColmena]);
            return res.redirect('/colmenas/listar/' + currentPage + '&' + idApiario);


        } catch (error) {
            req.flash('mensajeError', 'Ha habido un error interno, intente mas tarde');
            return res.redirect('/colmenas/modificar/' + idColmena + '&' + currentPage + '&' + idApiario);
        }
    }
    
};


// Metodos que se usan por ajax desde el cliente
controlador.buscarIdReina = async (req, res) => {
    const { id } = req.body;

    await pool.query('select * from Reina where ID_reina = ?', [id], (err, rows) => {
        if(err) {
            res.send('error al buscar el id de reina: ' + err.code);
            return;
        }
        if(rows.length < 1) res.send('-1');
        res.json(rows[0]);
    });
    
};

controlador.registrarReina = async (req, res) => {

    const { descripcion, raza } = req.body;
    const nuevaReina = {
        Descripcion: descripcion,
        Raza: raza
    };

    await pool.query('insert into Reina set ?', [nuevaReina], async (err, result) => {
        
        if(err) res.send('Error al registrar Reina: ' + err.code);

        idInsertado = result.insertId;

        const nuevaReinaTieneEstado = {
            ID_estado: 1,
            ID_reina: idInsertado
        };

        await pool.query('insert into Reina_tiene set ?', [nuevaReinaTieneEstado], async (err, result) => {
            
            await pool.query('select * from Reina where ID_reina = ?', [idInsertado], (err, rows) => {

                if(err) res.send('Error al obtener Reina registrada: ' + err.code);
    
                if(rows.length < 1) res.send('-1');
    
                res.json(rows[0]);
    
            });
        });
    });
};

controlador.buscarIdApiario = async (req, res) => {

    const { id } = req.body;

    const sql = `
        select 
            at.ID_apiario, c.Nombre as Comuna, a.Calle, a.Numero, r.Nombre as Region, r.Ordinal, at.ID_rol
        from 
            Apiario a 
        inner join
            Apicultor_tiene at on at.ID_apiario = a.ID_apiario
        inner join 
            Comunas c on a.ID_comuna = c.ID_comuna 
        inner join 
            Regiones r on c.ID_region = r.ID_region 
        where 
            at.ID_apiario = ?
        and 
            at.ID_apicultor = ?
    `;

    await pool.query(sql, [id, req.user.ID_apicultor], (err, rows) => {

        if(err) {
            res.send('error al buscar el id de apiario: ' + err.code);
            return;
        }

        if(rows.length < 1) res.send('-1');
        res.json(rows[0]);
    });

};

controlador.buscarIdPadre = async (req, res) => {


    const idPadreColmena = req.body.id;

    await pool.query('select * from Colmena where ID_colmena = ?', [idPadreColmena], (err, rows) => {

        if(rows.length < 1) {
            return res.json({respuesta: '-1'});
        }

        return res.json({respuesta: 'ok'});

    });

};

controlador.actualizarReina = async (req, res) => {

    const { idReina, raza, descripcion } = req.body;

    const sqlActualizarReina = 'update Reina set raza = ?, descripcion = ? where ID_reina = ?';
    await pool.query(sqlActualizarReina, [raza, descripcion, idReina], (err, result) => {

        if(err) return res.json({respuesta: 'error'});

        else return res.json({
            respuesta: 'ok',
            razaIngresada: raza,
            descripcionIngresada: descripcion
        });
        
    });
};










module.exports = controlador;

// Rut del usuario para test en rf3 : 13.783.297-6


