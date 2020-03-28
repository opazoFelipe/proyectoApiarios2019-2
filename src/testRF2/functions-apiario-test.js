const mysql = require('mysql');
const pool = require('./database-test-mocha');

exports.obtenerComunas = async (id) => {
    const rows = await pool.query('SELECT ID_comuna as id, nombre FROM comunas WHERE ID_region = ?', [id]);
    if(rows.length > 0) return true;
    else return false;
};

exports.insertarApiario = async (comuna, calle, numero) => {
    try {
      const rows = await pool.query('INSERT INTO Apiario VALUES (?, ?, ?, ?, now());', ["default", comuna, calle, numero]);
      await pool.query('DELETE FROM Apiario WHERE ID_apiario = ' + rows.insertId);
      if(rows.affectedRows > 0) return true;
      throw false;
    }
    catch (e) {
      return false;
    }
};

exports.insertarApiarioTiene = async (Id_apiario, Id_estado) => {
  try {
    const apiarioCheck = await pool.query('SELECT * FROM Apiario WHERE ID_apiario = ' + Id_apiario);
    if(apiarioCheck.length == 0) return false;
    const rows = await pool.query('INSERT INTO Apiario_tiene VALUES (?, ?, now());', [Id_estado, Id_apiario]);
    await pool.query('DELETE FROM Apiario_tiene WHERE ID_apiario = ' + Id_apiario + " AND ID_estado = " + Id_estado);
    if(rows.affectedRows > 0) return true;
    throw false;
  }
  catch (e) {
    return false;
  }
};

exports.obtenerApiarios = async (id) => {
  const rows = await pool.query('SELECT ID_apiario as id FROM Apiario WHERE ID_apiario = ?', [id]);
  if(rows.length > 0) return true;
  else return false;
};

exports.modificarApiario = async (Id_Comuna, Calle, Numero, Id_apiario) => {
  try {
    const rows = await pool.query('UPDATE apiario SET ID_comuna= ?, Calle = ?, Numero = ?, Fecha_creacion = now() WHERE ID_apiario = ?', [Id_Comuna, Calle, Numero, Id_apiario]);
    if(rows.affectedRows > 0) return true;
    throw false;
  }
  catch (e) {
    return false;
  }
};

exports.asignarApicultor = async (Id_apicultor, Id_apiario, Id_rol) => {
  try {
    const apiarioCheck = await pool.query('SELECT * FROM Apiario WHERE ID_apiario = ' + Id_apiario);
    if(apiarioCheck.length == 0) return false;
    const apicultorCheck = await pool.query('SELECT * FROM Apicultor WHERE ID_apicultor = ' + Id_apicultor);
    if(apicultorCheck.length == 0) return false;  
    const rolCheck = await pool.query('SELECT * FROM Rol WHERE ID_rol = ' + Id_rol);
    if(rolCheck.length == 0) return false;       
    const rows = await pool.query('INSERT INTO Apicultor_tiene VALUES (?, ?, ?, now());', [Id_apicultor, Id_rol, Id_apiario]);
    await pool.query('DELETE FROM Apicultor_tiene WHERE ID_apiario = ' + Id_apiario + " AND ID_apicultor = " + Id_apicultor);
    if(rows.affectedRows > 0) return true;
    throw false;
  }
  catch (e) {
    return false;
  }
};