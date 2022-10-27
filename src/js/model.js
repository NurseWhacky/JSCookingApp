import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON } from './helpers';
import { sendJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

// => NOT a pure function (manipulates state)
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    // change the format of the data received from the api
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    // temporary error handling
    console.error(`${err} 🤯!!`);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    // 1st store query into state
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    // 2nd store results (for analytics)
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🤯!!`);
    throw err;
  }
};

export const getSearchResultPage = function (page = /*state.search.page*/ 1) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQuantity = oldQuantity * newServings / oldServings
    ing.quantity *= newServings / state.recipe.servings;
  });
  // update servings in state
  state.recipe.servings = newServings;
};

// function to store bookmarks in local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark to array
  state.bookmarks.push(recipe);

  // Mark current recipe as  w/ new property 'bookmarked'
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  // Extract data in local storage to a variable
  const storage = localStorage.getItem('bookmarks');

  // if storage is not empty the JSON is parsed and converted back to object
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
// console.log(state.bookmarks);

// debugging function for development
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe))
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        // console.log(entry[0], entry[1])
      )
      .map(ing => {
        // we need to split the string coming from the form in 3 parts: quantity, unit and description
        const ingArray = ing[1].replaceAll(' ', '').split(',');
        if (ingArray.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format. :)'
          );

        const [quantity, unit, description] = ingArray;

        //
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(`${API_URL}?key=${API_KEY}`);
    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe)
    // console.log(data);
  } catch (err) {
    throw err;
  }
};

// clearBookmarks()
