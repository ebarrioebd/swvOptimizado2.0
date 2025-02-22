console.log("Indicadores.js")
/*let markers = []//new Array(); 
var groupMakers = L.layerGroup(markers); 
*/
//agrega marcadores al mapa(map)
function addOvi(ovi_i) {
    markers = []
    groupMakers.remove();
    var _i = 0;
    let content_popup = ``;
    for (var j = 0; j < ovi_i.length; j++) {
        for (var i = 0; i < ovi_i[j].length; i++) {
            if (!isNaN(ovi_i[j][i].latitud) && !isNaN(ovi_i[j][i].longitud)) {
                content_popup = `
                <div class="popup">
                <div class="colonia"><strong> COLONIA ${ovi_i[j][i].nom_col} </strong><br><hr></div>
                    <div class="coordenadas_title"><strong>COORDENADAS</strong> </div>
                    <div class="coordenadas">[${ovi_i[j][i].latitud},${ovi_i[j][i].longitud}] </div> 
                    <div class="cantidad_title"> <strong>CANTIDAD DE HUEVOS</strong></div>
                    <div class="cantidad">${ovi_i[j][i].cantidad_huevos}</div>
                </div>
                `;
                /* `
                <b>Latitud:</b>${ovi_i[j][i].latitud}<br>
                <b>Longitud:</b>${ovi_i[j][i].longitud}<br>
                <b>Colonia</b> :${ ovi_i[j][i].nom_col}<br>
                <b>cant :</b> <var>${ovi_i[j][i].cantidad_huevos}</var>`*/
                markers[_i] = L.marker([ovi_i[j][i].latitud, ovi_i[j][i].longitud], { color: "red", draggable: false, title: "" + ovi_i[j][i].cantidad_huevos });
                markers[_i].bindPopup(content_popup)
                _i++; //index markers
            }
        }
        //}
    }
    groupMakers = L.layerGroup(markers);
}
function verZona(gid) { 
    const foundZona = zonaGeneral.find(elem => elem.properties.gid == gid)
    //map.setView(new L.LatLng(zonaGeneral[0].geometry.coordinates[0][0][0][1], zonaGeneral[0].geometry.coordinates[0][0][0][0]));
    try {
        const centroZona = turf.centerOfMass(foundZona).geometry.coordinates; 
        map.setView(new L.LatLng(centroZona[1], centroZona[0]));
    } catch (err) { 
        map.setView(new L.LatLng(foundZona.geometry.coordinates[0][0][0][1], foundZona.geometry.coordinates[0][0][0][0]));

    }
}
function addZonaName(data) {
    var doc_ = "";
    for (var i = 0; i < data.length; i++) {
        doc_ += '<tr><td id="td_color" style="background:' + data[i].color + ' ;text-shadow: 2px 0 black, -2px 0 black, 0 2px black, 0 -2px black, 1px 1px black, -1px -1px black, -1px 1px black, 1px -1px black;font-size: 18px;width: 2px;" >' + data[i].cant_h.length + '</td><td style="text-align: initial"><button style="width: 100%;cursor:zoom-in;background: transparent;text-align: left;color: white;" onclick="verZona(' + '\'' + data[i].gid + '\'' + ')">' + data[i].nom_col + '</button> </td><td>' + parseInt(data[i].suma) + '</td></tr>';
    }
    document.getElementById("zona_name").innerHTML = '<table style="width:100%"><thead><th>#Ovit</th><th>Colonia</th> <th>#Huevos</th></thead><tbody>' + doc_ + '<tbody></table>';
}
//funcion fin
function generarNumero(numero) {
    return (Math.random() * numero).toFixed(0);
}
var _PH = [] //indices de recipientes
function colorRGB() {
    return "rgb" + "(" + generarNumero(255) + "," + generarNumero(255) + "," + generarNumero(255) + ")";
}

function mostrarVentanaEstDesc() {
    document.getElementById("cont").style.filter = "blur(14px)"
    document.getElementById("ventanaEstDesc").style.display = ""
    disabled_touch_div_maps();
}

function closeTableDescri() {
    document.getElementById("cont").style.filter = "blur(0px)"
    document.getElementById("ventanaEstDesc").style.display = "none"
    enabled_touch_div_maps();
}

function createTablaDescriptivos(data) {
    document.getElementById("decriptivo_table_body").innerHTML = ""
    var tr = "" 
    let dh = []
    for (var i = 0; i < data.length; i++) {
        tr += `<tr>
           <td>${data[i].gid}</td><td>${data[i].nom_col}</td><td>${data[i].cant_h.length}</td><td>${data[i].suma}</td>
           <td>${data[i].media.toFixed(2)}</td><td>${data[i].varianza.toFixed(2)}</td><td>${data[i].desviacionEstandar.toFixed(2)}</td>
           <td>${data[i].minimo}</td><td>${data[i].maximo}</td><td>${data[i].maximo - data[i].minimo}</td>
           <td><button onclick="calcularHistograma(${i})">Ver Histograma</button></td>
        </tr>`;
    }
    document.getElementById("decriptivo_table_body").innerHTML = tr
}

function groupOvi(arr) { 
    let a = [
        []
    ]
    let k = 0;
    for (var i = 0; i < arr.length; i++) {
        if (i > 0 && arr[i]['gid'] !== arr[i - 1]['gid']) {
            a.push([])
            k++;
        }
        a[k].push(arr[i]);

    }
    return a;
}
var colorsL = [] //color de cada labels 
//generar indicadores entomologicos
function varza(m, x) {
    let suma = 0
    for (let i = 0; i < x.length; i++) {
        suma += Math.pow(x[i] - m, 2);
    }
    return [suma / (x.length - 1), Math.sqrt(suma / x.length - 1)]
}

function calcularEstadisticosDescriptivos(data) {
    const n = data.length;
    if (n === 0) return null; // Devolver null si la data está vacía

    let suma = 0, sumaCuadrados = 0, min = Infinity, max = -Infinity, cont_zeros = 0;

    for (let i = 0; i < n; i++) {
        const val = data[i];
        suma += val;
        sumaCuadrados += val * val;
        if (val < min) min = val;
        if (val > max) max = val;
        if (val === 0) cont_zeros++;
    }

    const media = suma / n;
    const varianza = sumaCuadrados / n - media * media;
    const desviacionEstandar = Math.sqrt(varianza);

    return {
        zeros: cont_zeros,
        minimo: min,
        maximo: max,
        suma: suma,
        media: media,
        varianza: varianza,
        desviacionEstandar: desviacionEstandar
    };
}

function reiniciarInformacionDeGraficas() {
    chart_promedio_huevos.data.labels = []
    chart_promedio_huevos.data.datasets[0].data = []
    //datos de porcentaje de ovitrampas positivas 
    chart_porcentaje_ovi_positiva.data.labels = []
    chart_porcentaje_ovi_positiva.data.datasets[0].data = []
    //porcentaje de huevos por colonias
    porcentaje_por_colonia.data.labels = []
    porcentaje_por_colonia.data.datasets[0].backgroundColor = []
    porcentaje_por_colonia.data.datasets[0].data = []
}

var data_ovi_max;
var data_cant_huevos;

function indicadores(inf_ovi, _zona, type_dat) {
    reiniciarInformacionDeGraficas()
    data_ovi_max = 0
    data_cant_huevos = []
    //Genera una Datalist de la cantidad de huevos para cada colonia
    let dataList = inf_ovi.map(colonia => colonia.map(data => data.cantidad_huevos));
    let cantidad_total_de_ovitrampas = dataList.reduce((total, arr) => total + arr.length, 0);
    let c_pop = { //val para chart porcentaje de ovitrampa positiva
        nom_col: [], //save nombre de las colonias
        pop: [],
        gid: []
    } 
    let estadis = [] //Objeto de Estadisticos descriptivos
    let cant_total_huevos = 0
    let data_max = []
    for (let i = 0; i < dataList.length; i++) {
        estadis.push(calcularEstadisticosDescriptivos(dataList[i]));
        data_max.push(estadis[i].maximo)
        estadis[i].color = colorRGB();
        estadis[i].gid = inf_ovi[i][0].gid;
        estadis[i].cant_h = dataList[i];
        data_cant_huevos[i] = dataList[i]
        estadis[i].nom_col = inf_ovi[i][0].nom_col;
        estadis[i].porcentaje_ovi_pos = 100 - (estadis[i].zeros * 100 / estadis[i].cant_h.length)
        cant_total_huevos += estadis[i].suma
        c_pop.gid.push(inf_ovi[i][0].gid)
        c_pop.pop.push(estadis[i].porcentaje_ovi_pos.toFixed(1))
        c_pop.nom_col.push(inf_ovi[i][0].nom_col)
    }
    data_ovi_max = Math.max(...data_max)
    //Add Datos A graficas
    for (let i = 0; i < estadis.length; i++) {
        //datos de promedios de huevos
        chart_promedio_huevos.data.labels.push(estadis[i].nom_col)
        chart_promedio_huevos.data.datasets[0].data.push(estadis[i].media)
        //datos de porcentaje de ovitrampas positivas 
        chart_porcentaje_ovi_positiva.data.labels.push(estadis[i].nom_col)
        chart_porcentaje_ovi_positiva.data.datasets[0].data.push(estadis[i].porcentaje_ovi_pos)
        //porcentaje de huevos por colonias
        porcentaje_por_colonia.data.labels.push(estadis[i].nom_col)
        porcentaje_por_colonia.data.datasets[0].backgroundColor.push(estadis[i].color);
        porcentaje_por_colonia.data.datasets[0].data.push(estadis[i].suma * 100 / cant_total_huevos)
    }

    //Actualiza las Graficas (CHARTJS)
    //Proedio
    chart_promedio_huevos.update();
    //porcentaje de ovi positivas
    //if (c_pop.gid.length > 10) { chart_porcentaje_ovi_positiva.options.scales.x.display = false; } else { chart_porcentaje_ovi_positiva.options.scales.x.display = true; }
    chart_porcentaje_ovi_positiva.update();
    //Porcentaje huevos por colonia 
    porcentaje_por_colonia.update();

    //Html Doc 
    //Establecer la cantidad de ovitrampas
    document.getElementById("n_ovi").innerHTML = cantidad_total_de_ovitrampas;
    addZonaName(estadis)
    getZonas(_zona, c_pop, type_dat)

    addOvi(inf_ovi);
    createTablaDescriptivos(estadis)  
}


function sumClass(arr) {
    let suma = 0
    for (var i = 0; i < arr.length; i++) {
        suma += arr[i]
    }
    return suma
}

function crearHistogramaDeFrecuencias(od) {
    od.sort(function (a, b) { return a - b; });
    var dataVal = [];
    dataVal.push(od[0])
    var auxDataVal = od[0];
    for (var i = 0; i < od.length; i++) {
        if (auxDataVal !== od[i]) {
            dataVal.push(od[i]);
            auxDataVal = od[i];
        }
    }
    var contador = [];
    for (var i = 0; i < dataVal.length; i++) {
        var auxcontador = 0;
        for (var j = 0; j < od.length; j++) {
            if (dataVal[i] === od[j]) {
                auxcontador++;
            }
        }
        contador.push(auxcontador);
    }
    const cant_inter = 9;
    var inter = Math.ceil(Math.sqrt(od.length)) > cant_inter ? cant_inter : Math.ceil(Math.sqrt(od.length));
    var tamClases = Math.round(dataVal.length / inter);
    //var tamClases = Math.floor(dataVal.length / inter);
    var frecuencia = [];
    var interClass = [];

    for (var i = 0; i < inter - 1; i++) {
        frecuencia[i] = sumClass(contador.slice(tamClases * i, tamClases * (i + 1)));
        if (i < inter - 1) {
            interClass[i] = "[" + dataVal[tamClases * i] + "," + (dataVal[(tamClases * (i + 1))] - 1) + "]";
        } else {
            interClass[i] = "[" + dataVal[tamClases * i] + "-" + dataVal[(tamClases * (i)) + 1] + "]";
        }
    }
    frecuencia.push(sumClass(contador.slice(tamClases * (inter - 1))));
    //interClass.push(">" + dataVal[tamClases * (inter - 1)]);
    interClass.push("[" + dataVal[tamClases * (inter - 1)] + " , " + od[od.length - 1] + "]");

    return { frec: frecuencia, labelClass: interClass };
}
function crearHistogramaFrecuencia(data) {
    var data_freccuencia = {
        rango: 0,
        n_interval: 0,
        incremento: 0,
        frecuencias: [],
        label_interval: []

    }
    const datosOrdenados = data.sort(function (a, b) { return a - b; }); 
    data_freccuencia.rango = Math.abs(datosOrdenados[datosOrdenados.length - 1] - datosOrdenados[0]);
    data_freccuencia.n_interval = Math.ceil(Math.sqrt(datosOrdenados.length))
    data_freccuencia.incremento = data_freccuencia.rango / data_freccuencia.n_interval;

    var arr_interval = [];
    var arr_interval_aument = 0;
    for (let j = 0; j < data_freccuencia.n_interval; j++) {
        if (j <= 0) {
            arr_interval_aument += datosOrdenados[0];
            arr_interval.push(arr_interval_aument); 
        } else {
            arr_interval_aument += data_freccuencia.incremento;
            arr_interval.push(arr_interval_aument); 
        }
    }
    const n_decimales = 2
    var cont_frec = 0
    for (let i = 0; i < data_freccuencia.n_interval; i++) {
        if (i < data_freccuencia.n_interval - 1) {
            data_freccuencia.label_interval[i] = "[ " + (arr_interval[i].toFixed(n_decimales)) + " , " + (arr_interval[i + 1].toFixed(n_decimales)) + ")";
        }
        if ((i + 1) == data_freccuencia.n_interval) {
            data_freccuencia.label_interval[i] = " > " + (arr_interval[i].toFixed(n_decimales));
        }
        for (let j = 0; j < datosOrdenados.length; j++) {
            if (datosOrdenados[j] >= arr_interval[i] && datosOrdenados[j] < arr_interval[i + 1]) {
                cont_frec++;
            }
            if ((i + 1) == data_freccuencia.n_interval) {
                if (datosOrdenados[j] >= arr_interval[i]) {
                    cont_frec++;
                }
            }
        }
        data_freccuencia.frecuencias[i] = cont_frec;
        cont_frec = 0;
    } 
    return data_freccuencia;
}
function calcularHistograma(index) {
    document.getElementById("ventanaHistogramaDeFrecuencias").style.display = "";
    var hist = crearHistogramaDeFrecuencias(data_cant_huevos[index])
    barChartHistograma.data.labels = hist.labelClass;
    barChartHistograma.data.datasets[0].data = hist.frec;

    //var hist = crearHistogramaFrecuencia(data_cant_huevos[index]) 
    //barChartHistograma.data.labels = hist.label_interval;
    //barChartHistograma.data.datasets[0].data = hist.frecuencias;

    barChartHistograma.update();
}

function closeHistograma() { document.getElementById("ventanaHistogramaDeFrecuencias").style.display = "none"; }

function promedio(lista) {
    var suma = 0;
    for (var i = 0; i < lista.length; i++) {
        suma += (lista[i]);
    }
    var promedio = suma / lista.length;
    return promedio;
}

function calcularRectaDeMejorAjuste(punto1, punto2) {
    var n = punto1.length;

    // Calcular sumatorias
    var sumX = 0;
    var sumY = 0;
    var sumXY = 0;
    var sumXX = 0;
    for (var i = 0; i < n; i++) {
        var x = punto1[i];
        var y = punto2[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    // Calcular coeficientes de la recta de mejor ajuste
    var m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    var b = (sumY - m * sumX) / n;

    return [m, b];
}

function calcularCorrelacion(variableX, variableY) {
    var n = variableX.length;

    // Calcular sumatorias
    var sumX = 0;
    var sumY = 0;
    var sumXY = 0;
    var sumXX = 0;
    var sumYY = 0;
    for (var i = 0; i < n; i++) {
        var x = variableX[i];
        var y = variableY[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
        sumYY += y * y;
    }

    // Calcular coeficiente de correlación de Pearson
    var numerador = n * sumXY - sumX * sumY;
    var denominador = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    var correlacion = numerador / denominador;

    return correlacion;
}