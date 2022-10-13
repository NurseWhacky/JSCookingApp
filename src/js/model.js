import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
  }
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
    console.log(state.recipe);
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
    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    // console.log(state.search.result);
  } catch (err) {
    console.error(`${err} 🤯!!`);
    throw err;
  }
};

