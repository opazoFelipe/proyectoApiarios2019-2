const controlador = {};
const pool = require('../../../database');
const { promisify } = require('util');
pool.query = promisify(pool.query);

// Renderizado de vistas

controlador.renderizarIngresarRegistroAlza = async (req, res) => {

    const { id, currentPage, idApiario } = req.params;

    try {
        
        const dataView = {};
        var alzaInicial = 0;
        var alzasAgregadas = 0;
        var alzasSacadas = 0;
        var cantidadAlzaParaSacar = 0;
        var cantidadAlzaParaPoner = 0;
        var mediasAlzasActuales = 0;

        // Se calcula todo con medias alzas (1 alza = 2 medias alzas)
        // Tipo alza
        // 1 : Alza
        // 2: Media Alza

        // Accion alza
        // 2 : agregar alza
        // 3 : sacar alza

        // Obtener alza inicial
        const rows1 = await pool.query('select * from Registro_alza where ID_colmena = ? and ID_accion = 1', [id]);

        if(rows1[0]. ID_tipoAlza == 1) alzaInicial = (rows1[0].Cantidad * 2 );
        if(rows1[0]. ID_tipoAlza == 2) alzaInicial = (rows1[0].Cantidad);
        
        // Obtener alzas que se han sacado y agregado
        const rows2 = await pool.query('select ID_tipoAlza, Cantidad, ID_accion from Registro_alza where ID_colmena = ? and ID_accion > 1', [id]);

        rows2.forEach(ra => {
            
            // Alzas agregadas
            if(ra.ID_tipoAlza == 1 && ra.ID_accion == 2 && ra.Cantidad != 0) {
                    alzasAgregadas += ( ra.Cantidad * 2); 
            }

            // Medias alzas agregadas
            if(ra.ID_tipoAlza == 2 && ra.ID_accion == 2 && ra.Cantidad != 0) {
                    alzasAgregadas += ra.Cantidad; 
            }

            // Alzas sacadas
            if(ra.ID_tipoAlza == 1 && ra.ID_accion == 3 && ra.Cantidad != 0) {
                alzasSacadas += ( ra.Cantidad * 2); 
            }

            // Medias alzas sacadas
            if(ra.ID_tipoAlza == 2 && ra.ID_accion == 3 && ra.Cantidad != 0) {
                    alzasSacadas += ra.Cantidad; 
            }

        });

        mediasAlzasActuales = (alzaInicial + alzasAgregadas - alzasSacadas);
        cantidadAlzaParaPoner = 8 - mediasAlzasActuales;
        cantidadAlzaParaSacar = mediasAlzasActuales;

        dataView.alzas = {
            mediasAlzasActuales,
            mediasAlzasParaSacar: cantidadAlzaParaSacar,
            mediasAlzasParaPoner: cantidadAlzaParaPoner
        };

        const rows3 = await pool.query('select * from Tipo_alza');
        dataView.tiposAlzas = rows3;

        const rows4 = await pool.query('select * from Accion_alza where ID_accion > 1');
        dataView.accionesAlzas =rows4;

        res.render('RF5/alzas/ingresarAlza', {id, currentPage, dataView, idApiario});
        
    } catch (error) {
        
        console.error('Error al renderizar ingreso registro alza colmena: ' + error);
        req.flash('mensajeError', 'Error al renderizar ingreso registrar alza ');
        res.redirect('/colmenas/detalles/' + id + '&' + currentPage + '&' + idApiario);
    }

};

controlador.renderizarRegistrosAlzas = async (req, res) => {

    const { id, currentPage, idApiario } = req.params;
   
    // Definir la paginacion
    let perPage = 6;
    let skip = ( currentPage * perPage ) - perPage;
    let numPages;

    try {

        const sqlCant = 'select count(*) as cantidad from Registro_alza where ID_colmena = ?';
        const rows2 = await pool.query(sqlCant, [id]);

        numPages = Math.ceil( rows2[0].cantidad / perPage );

        const sql = `
            select 
                ra.ID_alza, ta.Descripcion, date_format(ra.Fecha, "%d-%m-%Y") as Fecha_creacion , ra.Cantidad, aa.Descripcion as Accion
            from
                Registro_alza ra
            inner join
                Accion_alza aa on ra.ID_accion = aa.ID_accion
            Inner join
                Tipo_alza ta on ra.ID_tipoAlza = ta.ID_tipoAlza
            where 
                ra.ID_colmena = ? order by ra.ID_alza limit ? offset ?;  
        `;

        const rows = await pool.query(sql, [id, perPage, skip]);
        
        if(rows.length < 1) {
            req.flash('mensajeCorrecto', 'No existe historial Alzas registradas');
            return res.redirect('/colmenas/detalles/' + id + '&' + currentPage + '&' + idApiario);
        }

        res.render('RF5/alzas/listarAlzas', {
            data: rows,
            current: currentPage,
            pages: numPages,
            perPage, 
            id,
            idApiario
        });
        
    } catch (error) {
        console.error('Error al renderizar historial de alzas: ' + error);
        req.flash('mensajeError', 'Error al renderizar historial de alzas ');
        res.redirect('/colmenas/detalles/' + id + '&' + currentPage + '&' + idApiario);
    }

};


// Logica

controlador.registrarAlza = async (req, res) => {

    const { id, currentPage, idApiario } = req.params;
    const { idAccion, idTipoAlza, cantidad } = req.body;

    if(cantidad == 0) {
        req.flash('mensajeCorrecto', 'No se han agregado o sacado alzas');
        return res.redirect('/colmenas/detalles/' + id + '&' + currentPage + '&' + idApiario);
    }
    
    const nuevaAlza = {
        ID_colmena: id,
        ID_tipoAlza: idTipoAlza,
        cantidad: cantidad,
        ID_accion: idAccion
    }

    const sqlAlza = 'insert into Registro_alza set ?';

    try {
        
        const result = await pool.query(sqlAlza, [nuevaAlza]);
        req.flash('mensajeCorrecto', 'Ingreso registrado correctamente');
        res.redirect('/colmenas/detalles/' + id + '&' + currentPage + '&' + idApiario);

    } catch (error) {

        console.error('Error al registrar registro alza: ' + error);
        req.flash('mensajeError', 'Error al ingresar registro alza');
        res.redirect('/colmenas/detalles/' + id + '&' + currentPage + '&' + idApiario);
    }
   
};

module.exports = controlador;