/**
 * @author Adrián Perera Hernández
 * 
 */

import { gameData } from '../data/questions.js';

const datos = gameData;
console.log(datos);
const cifpcmLocation = [28.455798, -16.282786];

/**
 * Carga la fichas de la partida y pone en marcha todos sus mecanismos cuando el usuario pulsa el botón de comenzar.
 */
function start() {
  let tiempo = 1;
  clearNodes(filaCiudades);
  clearNodes(filaPaises)
  let temporizador = setInterval(cronometro, 1000);
  function cronometro() {
    document.getElementById("cronometro").innerHTML = 'Tiempo: ' + tiempo++ + 's';
  }
  let gameArr = cargarFichas();
  dragDrop(gameArr);
  //pintarMapa(gameArr);

}

/**
 *Elimina todos los nodos hijo de la partida anterior, para limpiar el tablero.
 *
 * @param {*} myNode - Nodo cuyos hijos deseamos eliminar.
 */
function clearNodes(myNode) {
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }
}

/**
 *Función que detiene el temporizador cuando el usuario acierta todas las preguntas
 *
 */
function finish() {
  clearInterval(temporizador);
}

const newGame = document.getElementById("newGame");
newGame.addEventListener("click", start);

const tablero = document.getElementById('tablero');
const filaCiudades = document.querySelector("#ciudades");
const filaPaises = document.querySelector("#paises");

/**
 *Llama a las funciones que cargan las fichas con ciudades y paises
 *
 * @return {Array} gameArr - Array con el número de pares ciudad/pais deseado (en este caso 5).
 */
function cargarFichas() {

  let gameArr = seleccionarFichas(datos.countries, 5);
  console.log("Array de 5 paises para la partida");
  console.log(gameArr);

  gameArr.forEach(country => crearFicha(country));

  $("#ciudades").ready(function () {
    $("#ciudades").randomize("div");
  });
  /*
  $("#paises").ready(function() {
    $("#paises:first-child").randomize("div");
  });
  */
  return gameArr;
}

/**
 *Recibe un array y devuelve un numero determinado de objetos elegidos de forma aleatoria.
 *
 * @param {*} arr - 
 * @param {*} amount - 
 * @return {*} 
 */
function seleccionarFichas(arr, amount) {
  let selectedObjs = [];
  for (let i = 0; i < amount; i++) {
    let addObj = false;
    do {
      let randomObj = arr[random(arr.length)];
      if (selectedObjs.includes(randomObj) == false) {
        selectedObjs.push(randomObj);
        addObj = true;
      }
    } while (addObj == false);
  }
  return selectedObjs;
}

/**
 *Devuelve un número aleatorio entre 0 y el máximo establecido.
 *
 * @param {int} max - El máximo alcanzable por el número aleatorio.
 * @return {int} - El número aleatorio entre 0 y max.
 */
function random(max) {
  return Math.floor(Math.random() * max);
}

/**
 *Función que crea nodos para agregar posteriormente al DOM.
 *
 * @param {string} tagName - Etiqueta HTML
 * @param {string} nodeText - Texto del atributo text.
 * @param {string} nodeId - Nombre del atributo id.
 * @param {Array} nodeClasses - Array con los nombres de las clases deseadas.
 * @param {Array} nodeAttributes - Array con pares clave/valor de los atributos extra deseados.
 * @return {*} Nodo con todas las características establecidas.
 */
function crearNodo(tagName, nodeText, nodeId, nodeClasses, nodeAttributes) {
  let nodeElement = document.createElement(tagName);

  if (nodeText != null) {
    nodeElement.setAttribute("text", nodeText);
  }

  if (nodeId != null) {
    nodeElement.setAttribute("id", nodeId);
  }

  if (nodeClasses.length > 0) {
    nodeClasses.forEach(className => {
      nodeElement.classList.add(className);
    });
  }

  if (nodeAttributes.length > 0) {
    nodeAttributes.forEach(attribute => {
      nodeElement.setAttribute(attribute.name, attribute.value);
    });
  }

  return nodeElement;
}

/**
 *Renderiza las fichas de la partida en base a las HTML templates o, en caso de que el navegador no lo admita,
 *llama al método crearNodo para crear y añadir las fichas como nodos del DOM.
 *
 * @param {Array} data - Preguntas/respuestas de la partida que serán renderizadas.
 */
function crearFicha(data) {
  let ciudadAleatoria = data.cities[random(data.cities.length)];
  // Comprobar si el navegador soporta el elemento HTML template element chequeando
  // si tiene el atributo 'content'
  if ('content' in document.createElement('template')) {
    // Instanciar la ficha
    // y su contenido con el template
    var fichaCiudad = document.querySelector('#fichaCiudad'),
      ficha = fichaCiudad.content.querySelectorAll("div"),
      ciudad = fichaCiudad.content.querySelectorAll("p");
    ficha[0].setAttribute("data-countryCode", data.code);
    ficha[0].setAttribute("data-cityCode", ciudadAleatoria.cityCode);
    ficha[0].setAttribute("data-location", ciudadAleatoria.location);
    ciudad[0].textContent = ciudadAleatoria.name;

    // Clonar la nueva ficha de País e insertarla en la tabla
    var filaCiudades = document.querySelector("#ciudades");
    var clone = document.importNode(fichaCiudad.content, true);
    filaCiudades.appendChild(clone);
    // Instanciar la ficha
    // y su contenido con el template
    var fichaPais = document.querySelector('#fichaPais'),
      ficha = fichaPais.content.querySelectorAll("div"),
      area = ficha[0].lastElementChild,
      pais = fichaPais.content.querySelectorAll("p");
    fichaPais.lastElementChild
    area.setAttribute("data-countryCode", data.code);
    pais[0].textContent = data.name;

    // Clonar la nueva ficha de ciudad e insertarla en la tabla
    var filaPaises = document.querySelector("#paises");
    var clone = document.importNode(fichaPais.content, true);
    filaPaises.appendChild(clone);
  }
  else {
    // Forma alternativa de añadir filas mediante DOM porque el
    // elemento template no está soportado por el navegador.
    //Creamos los nodos ciudades
    let cityNode = crearNodo("div", null, null, ["draggable", "ui-widget-header"], [{ "data-countryCode": data.code }, { "data-cityCode": ciudadAleatoria.cityCode }]);
    console.log(cityNode);
    let cityText = crearNodo("p", null, null, [], []);
    cityText.appendChild(document.createTextNode(ciudadAleatoria.name));
    cityNode.appendChild(cityText);
    tablero.appendChild(cityNode);
    //creamos el nodo pais
    let countryNode = crearNodo("div", null, null, [], []);
    console.log(countryNode);
    let countryText = crearNodo("p", null, null, [], []);
    let countryDrop = crearNodo("div", null, null, ["droppable", "ui-widget-header"], [{ "data-countryCode": data.code }]);
    countryText.appendChild(document.createTextNode(data.name));
    countryNode.appendChild(countryDrop);
    countryNode.appendChild(countryText);
    tablero.appendChild(countryNode);
  }
}

//TODO: Botón de nueva partida, setAttribute disabled cuando está en partida

// ----- Jquery -----
//El objeto dragable/droppable genera dos objetos, un objeto de tipo evento y otro objeto de tipo UI. Detener la ejecución en el de tipo UI y usarlo para extraer la ciudad dragable depositada en el país dropable correspondiente.
/**
 *Métodos de jQuery UI para convertir nodos en objetos Draggables y Droppables.
 *
 * @param {*} arrayRespuestas - Preguntas/respuestas de las partidas.
 */
function dragDrop(arrayRespuestas) {

  $(".draggable").draggable({
    revert: true,
    /*
    start: function (event, ui) {
      ui.helper.data('dropped', false);
    },
    stop: function (event, ui) {
      alert('stop: dropped=' + ui.helper.data('dropped'));
      // Check value of ui.helper.data('dropped') and handle accordingly...
      $(this).addClass("green");
    }
    */
  });
  $(".droppable").droppable({

    //Hacemos la comparación del $(this)[0].dataset con ui.draggable[0].dataset
    //apuntando a datacountryCode y datacityCode
    drop: function (event, ui) {
      let dropCountryCode = $(this)[0].dataset.countrycode;
      let dragCountryCode = ui.draggable[0].dataset.countrycode;

      if (dropCountryCode == dragCountryCode) {
        $(this).addClass("ui-state-highlight");

        let dragCityCode = ui.draggable[0].dataset.citycode;
        //Extraemos la location (string) de la ciudad, la metemos en un array de 2 elementos (string) separados por la coma y los convertimos a float.
        let correctLocation = ui.draggable[0].dataset.location.split(",").map(element => parseFloat(element));

        //Extraemos el objeto del país en el array de los países de la partida, comparando el código de país con el depositado correctamente.
        let countryObj = arrayRespuestas.find(country => country.code == dragCountryCode);
        console.log(countryObj);
        //Extraemos el objeto de la ciudad en el objeto país extraído, comparando el código de ciudad con el depositada correctamente.
        let cityObj = countryObj.cities.find(city => city.cityCode == dragCityCode);
        console.log(cityObj);
        //Llamamos a la función que mueve el mapa a la ciudad correspondiente
        volar(mymap, correctLocation, cityObj.name);
        //Prevenir que vuelva a su posición
        $(ui.draggable[0]).revert(false);
      }
    }
  });
}

// ---- Leaflet Maps ----
const mymap = L.map('mapid');
document.addEventListener("load", pintarMapa(mymap, cifpcmLocation, "CIFP César Manrique"));

/**
 *Renderiza el mapa de Leaflet con los datos establecidos.
 *
 * @param {Object} map - Instancia de mapa Leaflet.
 * @param {Array} location - Latitud y longitud en la que nos queremos ubicar.
 * @param {String} name - Nombre que tendrá el tooltip del marcador.
 */
function pintarMapa(map, location, name) {
  map.setView(location, 16);
  let marker = L.marker(location).addTo(map);
  marker.bindTooltip(name).openTooltip();
}
/**
 *Similar a pintarMapa, pero genera la nueva ubicación con una animación de transición.
 *
 * @param {Object} map - Instancia de mapa Leaflet.
 * @param {Array} location - Latitud y longitud en la que nos queremos ubicar.
 * @param {String} name - Nombre que tendrá el tooltip del marcador.
 */
function volar(map, location, name) {
  map.flyTo(location, 16, {
    animate: true,
    duration: 8
  });
  let marker = L.marker(location).addTo(map);
  marker.bindTooltip(name).openTooltip();
}

//dataset.nombreAtributo
//Si tiene guiones, se pondría sin guiones y camelcase
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoibWlyc2hvIiwiYSI6ImNrNGNvZHp2NjA4aGUzbnBmZXUzeDNsYzEifQ.s-hIsqTuzgDHsybPpHF2_A'
}).addTo(mymap);

//?Función adaptada de internet
//this works, but it would be better to use Fisher-Yates
$.fn.randomize = function (selector) {
  var $elems = selector ? $(this).find(selector) : $(this).children(),
    $parents = $elems.parent();

  $parents.each(function () {
    $(this)
      .children(selector)
      .sort(function () {
        return Math.round(Math.random()) - 0.5;
      })
      .detach()
      .appendTo(this);
  });

  return this;
};

//!Pasar los datos correctos
// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

/**
 *Callback that creates and populates a data table,
 *instantiates the pie chart, passes in the data and
 *draws it.
 *
 */
function drawChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', 3],
    ['Onions', 1],
    ['Olives', 1],
    ['Zucchini', 1],
    ['Pepperoni', 2]
  ]);

  // Set chart options
  var options = {
    'title': 'How Much Pizza I Ate Last Night',
    'width': 400,
    'height': 300
  };

  // Instantiate and draw our chart, passing in some options.
  var pieChart = new google.visualization.PieChart(document.getElementById('pieChart'));
  pieChart.draw(data, options);
  var barChart = new google.visualization.BarChart(document.getElementById('barChart'));
  barChart.draw(data, options);
}
