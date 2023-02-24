'use strict';

//Llamo a las constantes del html
const writeCocktail = document.querySelector('.js-write-cocktail');
const searchBtn = document.querySelector('.js-search');
const resetBtn = document.querySelector('.js-reset');
const cocktailList = document.querySelector('.js-cocktail-list');
const favoriteList = document.querySelector('.js-favorite-list');

//creo una constante para la url para acortar.
let url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';

//creo dos array para meter los cócteles
let allDrinkList = [];
let favoriteDrinks = [];

//recuperar datos de la lista de favoritos desde el local storage
const cocktelsFavorites = JSON.parse(localStorage.getItem('favoritos'));
if (cocktelsFavorites) {
  favoriteDrinks = cocktelsFavorites;
  renderFavoriteList(favoriteDrinks);
}

//Fetch para obtener los datos de la API en la lista general
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    allDrinkList = data.drinks;
    renderCocktelsList(allDrinkList);
  });

//funcion para pintar todos los cócteles en la lista
function renderCocktelsList(allDrinkList) {
  cocktailList.innerHTML = '';
  for (const cocktail of allDrinkList) {
    cocktailList.innerHTML += renderCocktails(cocktail);
  }
  addEventToCocktail();
}

//función para pintar todos los cócteles de la lista de favoritos
function renderFavoriteList(favoriteDrinks) {
  favoriteList.innerHTML = '';
  for (const cocktail of favoriteDrinks) {
    favoriteList.innerHTML += renderCocktails(cocktail);
  }
  localStorage.setItem('favoritos', JSON.stringify(favoriteDrinks)); //guardar en el local storage la lista de mis favoritos
}

//Pintar un cóctel de la lista
function renderCocktails(cocktail) {
  let html = `<li class="listFinal"><section>
        <article class="js-li-cocktail" id=${cocktail.idDrink}>
        <h3 class="cocktail_title">${cocktail.strDrink}</h3>
        <img src="${cocktail.strDrinkThumb}" alt="foto de cóctel">
        </article>
        </section>
        <input type="button" class="btnClose" value="X">
    </li> `;
  return html;
}

//función de buscar un cóctel
function handleClickSearch(ev) {
  ev.preventDefault();
  console.log('entro');
  url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${writeCocktail.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      allDrinkList = data.drinks;
      renderCocktelsList(allDrinkList);
    });
}

//función para seleccionar un li de la lista de cócteles y hacerle un click.
function handleClickLi(ev) {
  //Buscar con ese id en el listado de cocktails que cocktail tiene el id del curren target, lo hacemos con un find (devuelve el objeto)
  const idSelected = ev.currentTarget.id;

  //find : devuelve el primer elemento que cumpla una condición
  const selectedCocktail = allDrinkList.find(
    (cocktail) => cocktail.idDrink === idSelected
  );

  //findeIndex: la posición donde está el elemento, o -1 sino está en el listado
  const indexCocktail = favoriteDrinks.findIndex(
    (cocktail) => cocktail.idDrink === idSelected
  );

  //Comprobar si ya existe el favorite
  if (indexCocktail === -1) {
    ev.currentTarget.classList.add('selected');
    //no está en el listado de favorito y añado selected al pinchar
    //La guardo en el listado de favoritos: push
    favoriteDrinks.push(selectedCocktail);
  } else {
    ev.currentTarget.classList.remove('selected');
    //si está en el listado de favoritos eliminarlo y eliminar la clase selected
    //splice: elimina un elemento a partir de una posición
    favoriteDrinks.splice(indexCocktail, 1);
  }
  //Pintar en el listado HTML de favoritos:
  renderFavoriteList(favoriteDrinks);
}

function addEventToCocktail() {
  const liElementsList = document.querySelectorAll('.js-li-cocktail');
  for (const li of liElementsList) {
    li.addEventListener('click', handleClickLi);
  }
}

//función para resetar
function handleClickReset(ev) {
  ev.preventDefault();
  writeCocktail.value = '';
  favoriteList.innerHTML = '';
  localStorage.removeItem('favoritos');
  location.reload();
}

//evento de búsqueda
searchBtn.addEventListener('click', handleClickSearch);
resetBtn.addEventListener('click', handleClickReset);
