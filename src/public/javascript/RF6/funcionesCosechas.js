$( document ).ready(function() {
    $("input").keyup(activarBoton);
    $("select").change(activarBoton);

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