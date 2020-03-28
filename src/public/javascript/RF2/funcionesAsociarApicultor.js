$( document ).ready(function() {
    $("#apicultor").keyup(buscarApicultor);
    $("#roles").change(buscarApicultor);

    function buscarApicultor(){
        var data ={};
        data.ID_apiario = $("#apiario").val();
        data.ID_apicultor = $("#apicultor").val(); 
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType:'json',
            url: '/apiarios/buscarApicultor',                      
            success: function(data) {
                console.log(data.message);
                if (data.result == true){
                    if ($("#roles").val() == "0"){
                        $("#botonSubmit").prop("disabled", true);
                    }  
                    else{
                        $("#botonSubmit").prop("disabled", false);
                    }
                    $("#message").attr('style','color: green');
                }
                else $("#message").attr('style','color: red');
                $("#message").html(data.message);               
            },
            error: function(error) {    
                console.log("some error in fetching the notifications");
             }
        });            
    }
});