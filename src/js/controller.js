// import all from model.js (dep injection?)
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { sendJSON } from './helpers.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SECS } from './config.js';

// if(module.hot) module.hot.accept();

// const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////
const controlRecipes = async function () {
  try {
    // id of recipe
    const id = window.location.hash.slice(1);
    console.log(id);

    // Guard
    if (!id) return;

    // Spinner
    recipeView.renderSpinner();

    // 0) Update results view and bookmarks to mark selected search result
    resultsView.update(model.getSearchResultPage());
    // 3) Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);
    // To leave everything unaltered we call this obj from model.js w/ the same name we used in the markup

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    // alert(e);
    // console.log(e);
    recipeView.renderError();
    console.error(e);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search result
    await model.loadSearchResult(query);
    // clearInput();

    // 3) Render result
    // console.log(model.state.search.results);
    // use THIS to test pagination
    // pagination controller depends on this function
    resultsView.render(model.getSearchResultPage());

    // 4) Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goto) {
  // 1) Render NEW results
  // console.log(model.state.search.results);
  // use THIS to test pagination
  // pagination controller depends on this function
  resultsView.render(model.getSearchResultPage(goto));

  // 2) Render NEW pagination button
  paginationView.render(model.state.search);
  // console.log(`Go to page ${goto}`);
};

const controlServings = function (servings) {
  // user increases/decreases servings => update recipe servings in state
  model.updateServings(servings);

  // update view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  // console.log(model.state.recipe.bookmarked);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close modal
    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SECS * 1000);
  } catch (err) {
    console.error('📍', err);
    addRecipeView.renderError(err.message);
  }
};

// Registered handlers
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
