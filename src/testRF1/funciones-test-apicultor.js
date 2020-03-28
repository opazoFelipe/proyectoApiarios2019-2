
const validator = require("email-validator");
const mysql = require('mysql');

const pool = require('./database-test-mocha');

exports.comprobarLargo = function( texto ) {
    if(texto.length > 0) return true;
    else return false;
};
  
function revisarDigito ( dvr )
{	
	dv = dvr + ""	
	if ( dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k'  && dv != 'K')	
	{		
		return false;	
	}	
	return true;
}

function revisarDigito2 ( crut )
{	
  largo = crut.length;	
  
	if ( largo < 2 )	
	{		
		return false;	
  }	
  
	if ( largo > 2 )		
		rut = crut.substring(0, largo - 1);	
	else		
		rut = crut.charAt(0);	
	dv = crut.charAt(largo-1);	
	revisarDigito( dv );	

	if ( rut == null || dv == null )
		return 0	

	var dvr = '0'	
	suma = 0	
	mul  = 2	

	for (i= rut.length -1 ; i >= 0; i--)	
	{	
		suma = suma + rut.charAt(i) * mul		
		if (mul == 7)			
			mul = 2		
		else    			
			mul++	
	}	
	res = suma % 11	
	if (res==1)		
		dvr = 'k'	
	else if (res==0)		
		dvr = '0'	
	else	
	{		
		dvi = 11-res		
		dvr = dvi + ""	
	}
	if ( dvr != dv.toLowerCase() )	
	{			
		return false	
	}

	return true
}

exports.validarRut = function ( texto ) {
  var tmpstr = "";
  for (i = 0; i < texto.length; i++)
    if (texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-')
      tmpstr = tmpstr + texto.charAt(i);
  texto = tmpstr;
  largo = texto.length;

  if (largo < 2) {
    return false;
  }

  for (i = 0; i < largo; i++) {
    if (texto.charAt(i) != "0" && texto.charAt(i) != "1" && texto.charAt(i) != "2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) != "5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) != "8" && texto.charAt(i) != "9" && texto.charAt(i) != "k" && texto.charAt(i) != "K") {
      // El valor ingresado no corresponde a un R.U.T valido	
      return false;
    }
  }

  var invertido = "";
  for (i = (largo - 1), j = 0; i >= 0; i--, j++)
    invertido = invertido + texto.charAt(i);
    var dtexto = "";
    dtexto = dtexto + invertido.charAt(0);
    dtexto = dtexto + '-';
    cnt = 0;

  for (i = 1, j = 2; i < largo; i++, j++) {
    //alert("i=[" + i + "] j=[" + j +"]" );		
    if (cnt == 3) {
      dtexto = dtexto + '.';
      j++;
      dtexto = dtexto + invertido.charAt(i);
      cnt = 1;
    }
    else {
      dtexto = dtexto + invertido.charAt(i);
      cnt++;
    }
  }

  invertido = "";
  for (i = (dtexto.length - 1), j = 0; i >= 0; i--, j++)
    invertido = invertido + dtexto.charAt(i);

  if (revisarDigito2(texto))
    return true;
  return false;
}

exports.validarCorreo = function ( correo ) {
  if(correo.length < 6) return false;
  if(correo.length > 100) return false;
  if(!validator.validate(correo)) {
    return false;
  } else return true; 
}

exports.validarFiltro = function ( filtro ) {
  if(filtro < 1 | filtro > 2) return false;
  else return true;
}

exports.comprobarRutDuplicado = async function ( id ) {

    const rut = id.toString();

    const rows = await pool.query('select * from Apicultor where ID_apicultor = ?', [rut]);
    if(rows.length > 0) return true;
    else return false;

}

exports.comprobarRutNoExistente = async function ( id ) {

  const rut = id.toString();

  const rows = await pool.query('select * from Apicultor where ID_apicultor = ?', [rut]);
  if(rows.length > 0) return false;
  else return true;

}








