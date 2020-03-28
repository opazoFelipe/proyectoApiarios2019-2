// Generar el qr de la colmena
function generarQrColmena() {

    const idColmena = document.getElementById("idColmena").value;
    document.getElementById("output").innerHTML = "";

    let qrcode = new QRCode("output", {
        width: 177,
        height: 177,
        colorDark : "#990000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
  
    qrcode.clear();
    qrcode.makeCode("http://localhost:4000/colmenas/detalles/"+idColmena+"&1");
}

function descargarQR() {

    const srcQR = document.getElementById("output").childNodes;
    var c = srcQR[0];
    // let filename = prompt("Guardar como","");

    // var dato = c.toDataURL("image/png");
    // dato = dato.replace("image/png", "image/octet-stream");
    // dato.download = filename;
    // document.location.href = dato;
    window.open(srcQR[1].src)
    
}