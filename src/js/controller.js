// import all from model.js (dep injection?)
import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// console.log(icons);

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function() {
  try {
    // id of recipe
    const id = window.location.hash.slice(1);
    console.log(id);

    // guard
    if(!id) return;
    // Spinner
    recipeView.renderSpinner();
    
    // 1) Loading recipe
    await model.loadRecipe(id);
    // To leave everything unaltered we call this obj from model.js w/ the same name we used in the markup

    // 2) Rendering the recipe
    recipeView.render(model.state.recipe);

      
  } catch (e) {
    alert(e);
  }
}

controlRecipes();

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipes));
window.addEventListener('hashchange', controlRecipes);
window.addEventListener('load', controlRecipes);