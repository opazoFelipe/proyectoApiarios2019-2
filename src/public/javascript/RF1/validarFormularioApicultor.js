//
// Validador de Rut
// Descargado desde http://www.juque.cl/
//

function renderMensajeError( mensaje ) {
	const html = `
		<div class="row fixed-bottom">
			<div class="col-md-3 ml-auto">
				<div class="alert alert-danger alert-dismissible fade show text-center" role="alert" style="background-color: red; color: white; z-index: 10000;">
					` + mensaje + `
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
					</button>
				</div>
			</div>
		</div>
	`;

	document.getElementById("mensaje").innerHTML = "";
	document.getElementById("mensaje").innerHTML = html;
}

function revisarDigito( dvr, form )
{	
	dv = dvr + ""	
	if ( dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k'  && dv != 'K')	
	{		
		renderMensajeError('Debe ingresar un digito verificador valido');		
		form.rut.focus();		
		form.rut.select();		
		return false;	
	}	
	return true;
}

function revisarDigito2( crut, form )
{	
	largo = crut.length;	
	if ( largo < 2 )	
	{		
		renderMensajeError('Debe ingresar el rut completo');	
		form.rut.focus();		
		form.rut.select();		
		return false;	
	}	
	if ( largo > 2 )		
		rut = crut.substring(0, largo - 1);	
	else		
		rut = crut.charAt(0);	
	dv = crut.charAt(largo-1);	
	revisarDigito( dv, form );	

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
		renderMensajeError('EL rut ingresado no es valido');	
		form.rut.focus();		
		form.rut.select();		
		return false	
	}

	return true
}

function validarRut( texto, form )
{	
	var tmpstr = "";	
	for ( i=0; i < texto.length ; i++ )		
		if ( texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-' )
			tmpstr = tmpstr + texto.charAt(i);	
	texto = tmpstr;	
	largo = texto.length;	

	if ( largo < 2 )	
	{		
		renderMensajeError('Debe ingresar el rut completo');		
		form.rut.focus();		
		form.rut.select();		
		return false;	
	}	

	for (i=0; i < largo ; i++ )	
	{			
		if ( texto.charAt(i) !="0" && texto.charAt(i) != "1" && texto.charAt(i) !="2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) !="5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) !="8" && texto.charAt(i) != "9" && texto.charAt(i) !="k" && texto.charAt(i) != "K" )
 		{			
			renderMensajeError('El valor ingresado no corresponde a un R.U.T valido');		
			form.rut.focus();			
			form.rut.select();			
			return false;		
		}	
	}	

	var invertido = "";	
	for ( i=(largo-1),j=0; i>=0; i--,j++ )		
		invertido = invertido + texto.charAt(i);	
	var dtexto = "";	
	dtexto = dtexto + invertido.charAt(0);	
	dtexto = dtexto + '-';	
	cnt = 0;	

	for ( i=1,j=2; i<largo; i++,j++ )	
	{		
		//alert("i=[" + i + "] j=[" + j +"]" );		
		if ( cnt == 3 )		
		{			
			dtexto = dtexto + '.';			
			j++;			
			dtexto = dtexto + invertido.charAt(i);			
			cnt = 1;		
		}		
		else		
		{				
			dtexto = dtexto + invertido.charAt(i);			
			cnt++;		
		}	
	}	

	invertido = "";	
	for ( i=(dtexto.length-1),j=0; i>=0; i--,j++ )		
		invertido = invertido + dtexto.charAt(i);	

	form.rut.value = invertido.toUpperCase()		

	if ( revisarDigito2(texto, form) )		
		return true;	

	return false;
}

function validarCampo(campo) {

	if( campo.value.length > 0 ) return true;

	else {
		campo.focus();		
		campo.select();
	}
}

function validarBandera(bandera, mensajeError) {

	if(!bandera) {
		renderMensajeError(mensajeError);
		return false;
	}
	return true;
}

// Sirve para login, registro, modificar datos, modificar contraseña y rechazar solicitud
function validarFormularioApicultor( form ) {

	event.preventDefault();

	let rutValido = false; 
	let correoValido = false;
	let nombreValido = false; 
	let apellidoMaternoValido = false; 
	let apellidoPaternoValido = false; 
	let passwordValido = false;
	let motivoValido = false;

	if(form.rut) {

		if( validarRut( form.rut.value, form ) ) rutValido = true;
		if(!rutValido) return;

	}

	if(form.correo) {
		if(form.correo.value.length < 6 | form.correo.value.length > 100) return renderMensajeError('Debe ingresar un correo de largo entre 6 a 100 caracteres');
		if(validarCampo( form.correo )) {

				correoValido = true;

		}

		if(validarBandera(correoValido, "Debe ingresar un Correo válido") == false) return; 
	}

	if(form.nombre) {
		if(form.nombre.value.length > 50) return renderMensajeError('El largo del Nombre no puede exeder 50 carácteres');
		if(isNaN(form.nombre.value)) {
			if(validarCampo( form.nombre )) nombreValido = true;
		}
		
		if(validarBandera(nombreValido, "Debe ingresar un Nombre válido") == false) return; 
	}

	if(form.apellidoPaterno) {
		if(form.apellidoPaterno.value.length > 50) return renderMensajeError('El largo del Apellido Paterno no puede exeder 50 carácteres');
		if(isNaN(form.apellidoPaterno.value)) {
			if(validarCampo( form.apellidoPaterno )) apellidoPaternoValido = true;
		}
		if(!validarBandera(apellidoPaternoValido, "Debe ingresar un Apellido Paterno Valido")) return;

	}

	if(form.apellidoMaterno) {
		if(form.apellidoPaterno.value.length > 50) return renderMensajeError('El largo del Apellido Materno no puede exeder 50 carácteres');
		if(isNaN(form.apellidoMaterno.value)) {
			if(validarCampo( form.apellidoMaterno )) apellidoMaternoValido = true;
		}

		if(!validarBandera(apellidoMaternoValido, "Debe ingresar un Apellido Materno Valido")) return;

	}

	if(form.password) {

		if(validarCampo( form.password )) passwordValido = true;
		if(!validarBandera(passwordValido, "Debe ingresar una contraseña")) return;

	}

	if(form.motivoRechazo) {
		if(isNaN(form.motivoRechazo.value)) {
			if(validarCampo( form.motivoRechazo )) motivoValido = true;
		}
		if(!validarBandera(motivoValido, "Debe escribir el Motivo de Rechazo para la solicitud")) return;
	}

	form.submit();

}
