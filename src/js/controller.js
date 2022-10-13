// import all from model.js (dep injection?)
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');


///////////////////////////////////////
const controlRecipes = async function () {
  try {
    // id of recipe
    const id = window.location.hash.slice(1);
    // console.log(id);

    // Guard
    if (!id) return;

    // Spinner
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);
    // To leave everything unaltered we call this obj from model.js w/ the same name we used in the markup

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    // alert(e);
    // console.log(e);
    recipeView.renderError()
  }
};

const controlSearchResults = async function() {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search result
    await model.loadSearchResult(query);
    // clearInput();

    // 3) Render result
    console.log(model.state.search.result);
  } catch (err) {
    console.error(err);
  }
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};


init();