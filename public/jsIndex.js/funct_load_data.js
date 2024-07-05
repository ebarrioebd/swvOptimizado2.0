/**
 * Prepara los datos antes de ser analizados
 */ 
function button_inactivo(valor, c) {
    var boton = document.getElementById("bsubmit")
    boton.disabled = valor
    boton.style.background = c;
}  
let data_ovi_csv = [] //guarda solo los datos del archivo que se selecciono 
let _json =[];//guarda todos los datos del archivo csv
/**
 * Prepara datos de un archivo .csv
 * Cargar datos desde Archivo csv
 */
//abre un div flotante para seleccionar el file.csv
function fileSelect() {
    document.getElementById("cont").style.filter = "blur(14px)";
    document.getElementById("filecsv").style.display = "";
}//colors//rango
function closedivCSV() {
    document.getElementById("cont").style.filter = "blur(0px)";
    document.getElementById("filecsv").style.display = "none";
}
//shows NomCol SELECT

function getArrayNomCol(_json) { 
    console.log(_json); 
    let selectZonaCSV = "";
    for (var i = 0; i < _json.length; i++) {
        selectZonaCSV += `
        <div class="row">
        <div  style=" padding-top: 4px;" ><input class="boxCSV" checked type="checkbox" value="${_json[i][0].gid}" id=""></div>
        <div  style=" width:100%;      margin-left: 10px; padding: 0">
        <select id="${_json[i][0].gid}-CSV" class="cCSV" onChange="ir_url(this)">
        <option ><marquee loop="40">${_json[i][0].nom_col}</marquee></option>
        <optgroup style="display:none" id="optgroup" label="Geostadisticos">
        <option value='[{"option":"interpolacion","zona":"${_json[i][0].nom_col}","zona_id":"${_json[i][0].gid}"}]' id="option"><a href="">- Interpolación</a></option>
        </optgroup>
        <optgroup style="display:none" id="optgroup" label="Estadisticos">
        <option value='[{"option":"descriptivo","zona":"${_json[i][0].nom_col}","zona_id":"${_json[i][0].gid}"}]' id="option">- Descriptios</option>
        </optgroup>
    </select>
    </div>
    </div>
    <br>
    `
    }
    document.getElementById("selectCSV").innerHTML = selectZonaCSV;
    slectZonaCSV = "";
}
function creaTablaCSV(datos, headers,id) {
    let tabla = `<table> 
                    <th>${headers[0]}</th>
                    <th>${headers[1]}</th>
                    <th>${headers[2]}</th>
                    <th>${headers[3]}</th>
                    <th>${headers[4]}</th>
            `;
    datos.forEach(element => {
        tabla += `
            <tr>
                <td>${element.latitud}</td>
                <td>${element.longitud}</td>
                <td>${element.gid}</td>
                <td>${element.nom_col}</td>
                <td>${element.cantidad_huevos}</td> 
            </tr>`;
    });
    document.getElementById(id).innerHTML = tabla + `<table>`
}
function agruparDatosJsosPorGid(json) {
    // Paso 1: Crear un objeto de agrupación
    let grouped = json.reduce((acc, curr) => {
        if (!acc[curr.gid]) {
            acc[curr.gid] = [];
        }
        acc[curr.gid].push(curr);
        return acc;
    }, {});

    // Paso 2: Convertir el objeto de agrupación en una lista de listas
    return Object.values(grouped);

}
function datoValido(dat) {
    if (dat[0].trim().length === 0 || isNaN(Number(dat[0])) ||
        dat[1].trim().length === 0 || dat[2].trim().length === 0 ||
        dat[3].trim().length === 0 || dat[4].trim().length === 0 || isNaN(Number(dat[4]))){
        return false;
    }
    return true; 
}
function csv_a_json(csv) {
    let json = [];
    let datos_invalidos =[];
    csv.forEach(value => {
        const fila = value.split(",").map(item => item.trim());
        if (datoValido(fila)) {
            json.push({
                latitud: parseFloat(fila[0]),
                longitud: parseFloat(fila[1]),
                gid: fila[2],
                nom_col: fila[3],
                cantidad_huevos: parseInt(fila[4]) 
            });
        }else{
            datos_invalidos.push(fila);
        }
    }); 
    return json;
}

function readFile(evt) {
    document.getElementById("csv_table").innerHTML = "";//vacia la tabla que visualiza los datos del archivo csv
    document.getElementById("selectCSV").innerHTML = "";//vacia la tabal que muestra las zonas del archivo csv
    let file = evt.target.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = (e) => { 
        let csv_data = e.target.result.split("\n");
        csv_data = csv_data.map(line => line.trim()).filter(line => line.length > 0); // Elimina líneas vacías
        let headers = csv_data.shift().split(","); // Eliminamos los headers

        let datos = csv_a_json(csv_data);
        creaTablaCSV(datos, headers, "csv_table");
        _json = agruparDatosJsosPorGid(datos)
        
        //obtiene nombre de las colonias para poder seleccionar las zonas a analizar
        getArrayNomCol(_json);

        document.getElementById("bCSV").innerHTML = "<strong style='font-size: inherit;color: #58ff00;'>" + document.getElementById('files').files[0].name + "</strong>";
        document.getElementById("files").value = "";
    };
    // Leemos el contenido del archivo seleccionado como texto
    reader.readAsText(file);
}
document.getElementById('files').addEventListener('change', readFile, false);
//funcion para mostrar el archivo cargado en el mapa


function getDataCSV() { 
    let checkselect = []
    $('input:checkbox.boxCSV').each(function () {
        if ($(this)[0].checked) {
            checkselect.push($(this).val());
        }
    });
    console.log("checkselect::",checkselect)
    if (checkselect.length > 0) { 
        data_ovi_csv = [];
        //se agregan solo los elementos que son seleccionados
        checkselect.forEach(element => {
            data_ovi_csv.push(_json.filter((elem)=> elem[0].gid === element)[0])
        });
        document.getElementById("cont").style.filter = "blur(0px)";
        document.getElementById("filecsv").style.display = "none";  

        indicadores(data_ovi_csv, checkselect, "type_csv"); 
    } else {
        alert("Seleccione una Colonia.")
    }
}
//fin de leer un CSV

//mostrar datos del archivo de colonias(Acapulco)
function abrirColoniasInfo() {
    window.open(window.location.origin + "/info_colonias_acapulco_inegi_2010", 'popup', 'width=' + (screen.width - 300) + ', height=' + (screen.height - 100) + ', left=' + 10 + ', top=' + 10 + '');
}
