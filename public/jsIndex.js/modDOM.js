function ocultarDivBD() {
    document.getElementById("sect11").style.display = "none";
    document.getElementById("sect21").style.display = "none"
    document.getElementById("graphPM").style = "width:-webkit-fill-available";
    document.getElementById("sect2").className = "col-md-6"
    document.getElementById("sect12").className = "col-md-8"
}
//console.log("ZONA:", zona)
function actServer() {
    console.log("actServer....")
    fetch("/serverAct", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                msg: "activar server..."
            })
        })
        .then(res => res.json())
        .then(data => {}).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
}
let div_cont = document.getElementById("cont");
let div_interpolarCSV = document.getElementById("interpolarCSV")
function disabled_interpolarCSV_div(){
    div_interpolarCSV.classList.add("div-disabled")
}
function enabled_interpolarCSV_div(){
    div_interpolarCSV.classList.remove("div-disabled")
}

function disabled_touch_div_maps(){   
    div_cont.classList.add("div-disabled");
}
function enabled_touch_div_maps(){  
    div_cont.classList.remove("div-disabled");
}
