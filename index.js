const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const body = document.querySelector('.main');
const loader = document.querySelector('.loader');
const formContainer = document.querySelector('.form-container');
const title = document.querySelector('.title');

// Se crea el array de los países
let countries = [];

// ----------- Funcion que pide todos los paises -------------->
const getCountries = async () => {
  // Llamo a la API
  // Transformo la respuesta a JSON
  const response = await (await fetch('https://restcountries.com/v3.1/all', {method: 'GET'})).json()
    
  // Guardo el array de los paises recibidos dentro de contries
  countries = response;
  console.log(countries);

  // Función para que el loader desaparezca en un tiempo determinado
  setTimeout(() => {
    loader.classList.add('hidden')
    body.classList.add('show-flex')
  }, 1000)
}
// Se llama la función una sola vez
getCountries();

// ------------ Función que pide el clima --------------------->
// Se le asigna un parámetro para el nombre del país
const getClimates = async (nombre) => {
  // Llamo a la API
  // Transformo la respuesta a JSON
  const responseClimate = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nombre}&lang=es&appid=88da22064aae277ab985f7314df2c6ee&units=metric`, {method: 'GET'})).json()
  return responseClimate;
}

// -------------- Evento del input ----------------------------->
searchInput.addEventListener('input', async e => {
  // Div container empieza vacío
  container.innerHTML = ''
  
  // Condicional que lee el tamaño del input para desaparecer el título
  if (searchInput.length !== 0) {
    title.classList.add ('title-hidden')
  }
  
  // Funcion que filtra cada país por su nombre, lo vuelve minúscula y lee el valor del input para buscar los países que empiecen por esa letra 
  const filteredCountries = countries.filter(element => element.name.common.toLowerCase().startsWith(e.target.value.toLowerCase()));
  console.log(filteredCountries);
  
  // Si no hay nada en el input, no mostrar nada en container
  if (searchInput.value === '') {
    container.innerHTML = ''
  }
  // Si hay más de 10 países, mostrar un mensaje   
  else if (filteredCountries.length > 10) {
    const message = document.createElement('div')
    message.classList.add ('menssage')
    message.innerHTML = `
    <p>Demasiados paises, especifica mejor tu respuesta</p>
    `
    container.append(message)
  } 
  // Si hay menos de 10 países, se muestran
  else if (filteredCountries.length < 10 && filteredCountries.length > 1) {
    
    // Función que trae la bandera y el nombre de cada país
    filteredCountries.forEach(element => {
        const countrys = document.createElement('div')
        countrys.classList.add ('pais')
        countrys.innerHTML = 
        `
        <img src="${element.flags.png}"/>
        <span>${element.name.common}</span>
        `;
        container.append (countrys)
    });
  } 
  // Si hay 1 solo país, mostrar su información
  else if (filteredCountries.length === 1) {
    // Llamo la función del clima y asigo el argumento
    const clima = await getClimates(filteredCountries[0].name.common)
    console.log(clima);
    // Guardo el ícono del clima en una variable
    const idClima = clima.weather[0].icon

    // Mostrar la información del país
    // toLocaleString() --> Separar los números con punto (línea 101)
    const info = document.createElement('div')
    info.classList.add ('info-pais')
    info.innerHTML = 
    `
    <div class= "img-country">
    <img class= "img-country" src="${filteredCountries[0].flags.png}">
    </div>
    <div class="info-country">
    <h1>${filteredCountries[0].name.common}</h1>
    <p>${filteredCountries[0].capital}</p>
    <p>${filteredCountries[0].population.toLocaleString()} habitantes</p>
    <p>${filteredCountries[0].region}</p>
    <p>${filteredCountries[0].timezones}</p>
    <p class="info-climate">${clima.main.temp} Celcius</p>

    <div class= "info-clima">
    <img class="idClima" src="https://openweathermap.org/img/wn/${idClima}@2x.png">
    <p class="info-clima-nom">${clima.weather[0].description}</p>
    </div>
    
    </div>
    `;
    container.append (info)
    
  } 
});