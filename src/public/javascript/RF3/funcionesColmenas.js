// Ajax para buscar la reina por ID
function buscarReinaPorID(form) {

    event.preventDefault();
    const idReina = form.idReina.value;
    ajax(idReina);

}

// Para buscar la reina por ID
function ajax(idReina) {
    // De esta forma se obtiene la instancia del objeto XMLHttpRequest
    if(window.XMLHttpRequest) {
      connection = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
      connection = new ActiveXObject("Microsoft.XMLHTTP");
    }
   
    var param = idReina;
   
    // Preparando la función de respuesta
    connection.onreadystatechange = response;
   
    // Realizando la petición HTTP con método POST
    connection.open('POST', 'http://localhost:4000/colmenas/buscarReina');
    connection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    connection.send("id=" + param);
}
   
function response() {
    if(connection.readyState == 4) {
        if(connection.responseText == '-1') { 
            document.getElementById("bodyTablaReina").innerHTML ="";
            document.getElementById("divDatosEncontrados").style = "display: none;";
            renderMensajeErrorColmena( 'el id ingresado no existe' );
            return;
        } else {
            try {
                const reina = JSON.parse(connection.responseText);
                document.getElementById("divDatosEncontrados").style = "";
                document.getElementById("bodyTablaReina").innerHTML ="";

                let tr = document.createElement("tr");

                let td1 = document.createElement("td");
                let td2 = document.createElement("td");
                let td3 = document.createElement("td");
                let td4 = document.createElement("td");

                let button = document.createElement("button");
                button.innerHTML = "Seleccionar";
                button.type = "button";
                button.className = "btn btn-primary";
                button.setAttribute("data-dismiss", "modal");
                button.onclick = function() {
                    document.getElementById("idReina").value = reina.ID_reina;
                    document.getElementById("idReinaHidden").value = reina.ID_reina;
                    document.getElementById("inputRaza").value = reina.Raza;

                    if(document.getElementById("idReinaOriginal")) {
                      if(document.getElementById("idReinaOriginal").value != reina.ID_reina) {
                        document.getElementById("divMotivoCambioReina").style = "";
                        document.getElementById("motivoCambioReina").autofocus;
                      } else {
                        document.getElementById("divMotivoCambioReina").style = "display: none;";
                      }
                    }
                    $('#modalReina').modal('hide');
                }
    
                td4.appendChild(button);

                td1.innerHTML = reina.ID_reina;
                td2.innerHTML = reina.Descripcion;
                td3.innerHTML = reina.Raza;

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);

                document.getElementById("bodyTablaReina").appendChild(tr);
                document.getElementById("mensaje").innerHTML = "";

            } catch (error) {
                document.getElementById("bodyTablaReina").innerHTML ="";
                document.getElementById("divDatosEncontrados").style = "display: none;";
                renderMensajeErrorColmena( 'el id ingresado no existe' );
            }
        }
    }
}

// Para guardar nueva reina
function ajax2(descripcion, raza) {
   
    // De esta forma se obtiene la instancia del objeto XMLHttpRequest
    if(window.XMLHttpRequest) {
      connection = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
      connection = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
   
    // Preparando la función de respuesta
    connection.onreadystatechange = response2;
   
    // Realizando la petición HTTP con método POST
    connection.open('POST', 'http://localhost:4000/colmenas/registrarReina');
    connection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    connection.send("descripcion=" + descripcion + "&raza=" + raza );
}

function response2() {

  if(connection.readyState == 4) {

    if(connection.responseText == '-1') return renderMensajeErrorColmena('Error al intentar obtener la Reina registrada');
    
    try {
      
      const reinaRegistrada = JSON.parse(connection.responseText);
      document.getElementById("idReina").value = reinaRegistrada.ID_reina;
      document.getElementById("inputRaza").value = reinaRegistrada.Raza;
      document.getElementById("idReinaHidden").value = reinaRegistrada.ID_reina;

      if(document.getElementById("idReinaOriginal")) {

        let idReinaOriginal = document.getElementById("idReinaOriginal").value;

        if(idReinaOriginal != document.getElementById("idReinaHidden").value) {
          document.getElementById("divMotivoCambioReina").style = "";
          document.getElementById("motivoCambioReina").autofocus;
        } else {
          document.getElementById("divMotivoCambioReina").style = "display: none;";
        }

        $('#modalNuevaReina').modal('hide');
        renderMensajeCorrectoColmena('Reina registrada correctamente');
      }

      $('#modalNuevaReina').modal('hide');
      renderMensajeCorrectoColmena('Reina registrada correctamente')

    } catch (error) {
      return renderMensajeErrorColmena(error);
    }
  
  }
}

function guardarReina(form) {

  event.preventDefault();
  const descripcion = form.descripcion.value;
  const raza = form.raza.value;

  if(descripcion.length < 1) return renderMensajeErrorColmena("Ingrese una descripción");
  if(raza.length < 1) return renderMensajeErrorColmena("Ingrese la raza");

  ajax2(descripcion, raza);

}

function mostrarInputIdColmena(select) {

  if(select.value == 3)
  {
      document.getElementById("divOrigenColmena").style = "";
      document.getElementById("inputColmenaOrigen").focus();
  } else {
      document.getElementById("divOrigenColmena").style = "display: none;";
  }

}

function cambiarCantidadAlza(select) {

  if(select.value == 2) 
  {
    let select = document.getElementById("selectCantidadAlza");
    select.innerHTML = "";

    for(let i = 0; i < 9; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;

        if(document.getElementById("cantidadAlzaInicial")) {
          if(document.getElementById("cantidadAlzaInicial").value == i) option.selected = true;
        }

        select.appendChild(option);
    }
  }
  if(select.value == 1) 
  {
    let select = document.getElementById("selectCantidadAlza");
    select.innerHTML = "";

    for(let i = 0; i < 5; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;

        if(document.getElementById("cantidadAlzaInicial")) {
          if(document.getElementById("cantidadAlzaInicial").value == i) option.selected = true;
        }
        
        select.appendChild(option);
    }
  }
}

function enviarFormularioColmena() {

  const form = document.getElementById("formularioColmena");

  const ID_origen = form.selectOrigen.value;
  const ID_colmenaPadre = form.inputColmenaOrigen.value;
  const ID_reina = form.idReina.value;
  const ID_colmena = document.getElementById("idColmena");

  console.log(ID_origen);
  console.log(ID_colmenaPadre);
  console.log(ID_reina);
  console.log(ID_colmena);

  if(ID_origen == 3) {
    if(ID_colmenaPadre.length < 1) {
      renderMensajeErrorColmena('Ingrese el ID (Número) del la Colmena Padre');
      return $('#exampleModal').modal('hide');
    }
    if(isNaN(ID_colmenaPadre)) {
      renderMensajeErrorColmena('Ingrese el ID (Número) del la Colmena Padre');
      return $('#exampleModal').modal('hide');
    }
    if(ID_colmenaPadre == ID_colmena) {
      renderMensajeErrorColmena('El ID de Colmena Padre debe ser distinto al ID de Colmena');
      return $('#exampleModal').modal('hide');
    }
    if(!isNaN(ID_colmenaPadre)) {
      ajaxIdPadreColmena(ID_colmenaPadre);
    }
  } else {
    if (ID_reina.length < 1 | isNaN(ID_reina)) {
      renderMensajeErrorColmena('Ingrese la raza de la Colmena (Ingresando el ID de la Reina)');
      return $('#exampleModal').modal('hide');
    } else {
  
      // Esto solo sirve para la vista modificar colmena
      if (form.motivoCambioReina && document.getElementById("idReinaOriginal")) {
  
        let idReinaOriginal = document.getElementById("idReinaOriginal").value;
  
        if (form.motivoCambioReina.value.length < 1 && idReinaOriginal != ID_reina) {
          renderMensajeErrorColmena('Ingrese el motivo del porque se ha cambiado la Reina a esta Colmena');
          return $('#exampleModal').modal('hide');
        }
      }
      return form.submit();
    } 
  }
}

function renderMensajeErrorColmena( mensaje ) {
	const html = `
    <div class="row fixed-bottom">
			<div class="col-md-3 ml-auto">
				<div class="alert alert-danger alert-dismissible fade show text-center" id="alerta" role="alert" style="background-color: red; color: white; z-index: 10000;">
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
  
function renderMensajeCorrectoColmena( mensaje ) {
    const html = `
      <div class="row fixed-bottom">
        <div class="col-md-3 ml-auto">
          <div class="alert alert-success alert-dismissible fade show text-center" role="alert" style="background-color: orange; color: white; z-index: 10000;">
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

// Ajax para buscar  Apiario por ID
function buscarApiarioPorID(form) {

  event.preventDefault();
  const idApiario = form.idApiario.value;
  if(isNaN(idApiario)) return renderMensajeErrorColmena('Ingrese un número');
  ajaxApiario(idApiario);

}

function ajaxApiario(idApiario) {
  // De esta forma se obtiene la instancia del objeto XMLHttpRequest
  if(window.XMLHttpRequest) {
    connection = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    connection = new ActiveXObject("Microsoft.XMLHTTP");
  }
 
  var param = idApiario;
 
  // Preparando la función de respuesta
  connection.onreadystatechange = responseApiario;
 
  // Realizando la petición HTTP con método POST
  connection.open('POST', 'http://localhost:4000/colmenas/buscarApiario');
  connection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  connection.send("id=" + param);
}
 
function responseApiario() {
  if(connection.readyState == 4) {
      if(connection.responseText == '-1') { 
          document.getElementById("bodyTablaApiario").innerHTML ="";
          document.getElementById("divDatosApiarioEncontrados").style = "display: none;";
          renderMensajeErrorColmena( 'el id ingresado no existe' );
          return;
      } else {
          try {
              const apiario = JSON.parse(connection.responseText);
              document.getElementById("divDatosApiarioEncontrados").style = "";
              document.getElementById("bodyTablaApiario").innerHTML ="";

              let tr = document.createElement("tr");

              let td1 = document.createElement("td");
              let td2 = document.createElement("td");
              let td3 = document.createElement("td");

              let button = document.createElement("button");
              button.innerHTML = "Seleccionar";
              button.type = "button";
              button.className = "btn btn-primary";
              button.setAttribute("data-dismiss", "modal");
              button.onclick = function() {
                  document.getElementById("idApiario").value = apiario.ID_apiario;
                  document.getElementById("idApiarioHidden").value = apiario.ID_apiario;
                  $('#modalApiario').modal('hide');
              }
  
              td3.appendChild(button);

              td1.innerHTML = apiario.ID_apiario;
              td2.innerHTML = "Calle " + apiario.Calle + ", número " + apiario.Numero + ". " + apiario.Comuna + ". <br>Región " + apiario.Region;
   
              tr.appendChild(td1);
              tr.appendChild(td2);
              tr.appendChild(td3);

              document.getElementById("bodyTablaApiario").appendChild(tr);
              document.getElementById("mensaje").innerHTML = "";

          } catch (error) {
              document.getElementById("bodyTablaApiario").innerHTML ="";
              document.getElementById("divDatosApiarioEncontrados").style = "display: none;";
              renderMensajeErrorColmena( 'el id ingresado no existe' );
          }
      }
  }
}


// Validar que el id padre exista
function ajaxIdPadreColmena(idPadreColmena) {

  // De esta forma se obtiene la instancia del objeto XMLHttpRequest
  if(window.XMLHttpRequest) {
    connection = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    connection = new ActiveXObject("Microsoft.XMLHTTP");
  }
 
  var param = idPadreColmena;
 
  // Preparando la función de respuesta
  connection.onreadystatechange = responsePadreColmena;
 
  // Realizando la petición HTTP con método POST
  connection.open('POST', 'http://localhost:4000/colmenas/buscarPadreColmena');
  connection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  connection.send("id=" + param);
}
 
function responsePadreColmena() {

  const form = document.getElementById("formularioColmena");

  const ID_reina = form.idReina.value;
 
  if(connection.readyState == 4) {

    try {
      
      const json = JSON.parse(connection.responseText);

      if(json.respuesta == 'ok') {

        if (ID_reina.length < 1 | isNaN(ID_reina)) {
          renderMensajeErrorColmena('Ingrese la raza de la Colmena (Ingresando el ID de la Reina)');
          return $('#exampleModal').modal('hide');
        } else {
      
          // Esto solo sirve para la vista modificar colmena
          if (form.motivoCambioReina && document.getElementById("idReinaOriginal")) {
      
            let idReinaOriginal = document.getElementById("idReinaOriginal").value;
      
            if (form.motivoCambioReina.value.length < 1 && idReinaOriginal != ID_reina) {
              renderMensajeErrorColmena('Ingrese el motivo del porque se ha cambiado la Reina a esta Colmena');
              return $('#exampleModal').modal('hide');
            }
          }
          return form.submit();
        }
      }

      if(json.respuesta == '-1') {
        renderMensajeErrorColmena('El ID ingresado de la Colmena Padre no existe');
        return $('#exampleModal').modal('hide');
      }
      
    } catch (error) {
      renderMensajeErrorColmena('El ID ingresado de la Colmena Padre no existe');
      return $('#exampleModal').modal('hide');
    }
  }
}

// -- Validar que el id padre exista


// Modificar los datos de la Reina en el modal de la vista detalles
function modificarDatosReina(form) {

  event.preventDefault();
  const raza = form.raza.value;
  const descripcion = form.descripcion.value;
  const currentPage = document.getElementById("currentPage").value;
  const idColmena = document.getElementById("idColmena").value;

  if(raza.length < 1) {
    form.raza.autofocus;
    return renderMensajeErrorColmena('Ingrese Raza');
  }
  if(descripcion.length < 1) {
    form.descripcion.autofocus;
    return renderMensajeErrorColmena('Ingrese Descripción ');  
  }

  const idReina = document.getElementById("idReina").value;
  
  ajaxModificarDatosReina(idReina, raza, descripcion, currentPage, idColmena);
}

function ajaxModificarDatosReina(idReina, raza, descripcion, currentPage, idColmena) {

  // De esta forma se obtiene la instancia del objeto XMLHttpRequest
  if(window.XMLHttpRequest) {
    connection = new XMLHttpRequest();
  }
  else if(window.ActiveXObject) {
    connection = new ActiveXObject("Microsoft.XMLHTTP");
  }
 
  var param = idReina;
 
  // Preparando la función de respuesta
  connection.onreadystatechange = responseModificarDatosReina;
 
  // Realizando la petición HTTP con método POST
  connection.open('POST', 'http://localhost:4000/colmenas/actualizarReina');
  connection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  connection.send("idReina=" + param + "&idColmena=" + idColmena + "&raza=" + raza + "&descripcion=" + descripcion + "&currentPage=" + currentPage);
}
 
function responseModificarDatosReina() {

  if(connection.readyState == 4) {

    try {

      const json = JSON.parse(connection.responseText);

      if(json.respuesta == 'ok') {

        document.getElementById("parrafoRaza").innerHTML = "Raza: " + json.razaIngresada;
        document.getElementById("parrafoDescripcion").innerHTML = "Descripción: <br>" + json.descripcionIngresada;
        document.getElementById("razaInicial").value = json.razaIngresada;
        document.getElementById("descripcionReinaInicial").value = json.descripcionIngresada;

        renderMensajeCorrectoColmena('Datos de Reina actualizados correctamente');
        return $('#modalModificarDatosReina').modal('hide');
      } else {
        renderMensajeErrorColmena('Error al actualizar colmena: ' + json.respuesta);
        return $('#modalModificarDatosReina').modal('hide');
      }

    } catch (error) {
      renderMensajeErrorColmena('Error al actualizar colmena: ' + error);
      return $('#modalModificarDatosReina').modal('hide');
    }
  }
}





