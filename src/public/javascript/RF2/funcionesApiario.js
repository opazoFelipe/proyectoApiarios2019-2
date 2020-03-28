$( document ).ready(function() {
    $("#region").change(cargarComunas);
    $("input").keyup(activarBoton);
    $("select").change(activarBoton);

    function cargarComunas(){
        var id = $("#region").val();
        if (id != 0){
            $.post("/apiarios/obtenerComunas/" + id, function(data){
                $("#botonSubmit").prop("disabled", true);
                $('#comuna').prop("disabled", false);
                $('#comuna')
                    .find('option')
                    .remove()
                    .end()
                    .append('<option value="0">Comuna</option>')
                    .val('0')
                ;
                for (var i=0; i < data.length; i++){
                    $('#comuna')
                        .append('<option value="' + data[i].id + '">' + data[i].nombre + '</option>')
                    ;                   
                }
            });
        }
        else{
            $('#comuna').prop("disabled", true);
            $('#comuna')
            .find('option')
            .remove()
            .end()
            .append('<option value="0">Comuna</option>')
            .val('0')
        ;
        }
    }

	function activarBoton(){
    	var a = true;
		$('form#formaApiario').find('input').each(function(){
			if ($(this).prop('required') && $(this).val() == ""){
				a = false;
			}
        });
		$('form#formaApiario').find('select').each(function(){
			if ($(this).prop('required') && $(this).val() == "0"){
				a = false;
			}
		});	        	
		if (a){
			$("#botonSubmit").prop("disabled", false);
		}
		else{
			$("#botonSubmit").prop("disabled", true);
		}	
	}    
});