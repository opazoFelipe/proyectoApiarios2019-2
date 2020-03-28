function ajax(crut) {
    // De esta forma se obtiene la instancia del objeto XMLHttpRequest
    if(window.XMLHttpRequest) {
      connection = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
      connection = new ActiveXObject("Microsoft.XMLHTTP");
    }
   
    var param = crut;
   
    // Preparando la función de respuesta
    connection.onreadystatechange = response;
   
    // Realizando la petición HTTP con método POST
    connection.open('POST', '/apicultores/filtrarPorRut');
    connection.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    connection.send("rut=" + param);
}
   
function response() {
    if(connection.readyState == 4) {
        if(connection.responseText == 'ok') { 
            
        } else {
            try {
                const reina = JSON.parse(connection.responseText);

            } catch (error) {
                document.getElementById("bodyTablaReina").innerHTML ="";
                document.getElementById("divDatosEncontrados").style = "display: none;";
                renderMensajeErrorColmena( 'el id ingresado no existe' );
            }
        }
    }
}