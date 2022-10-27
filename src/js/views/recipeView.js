import View from './View';

// Import assets from the dist folder
// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../../src/img/icons.svg'; // Parcel 2 syntax
import { Fraction } from 'fractional';
// console.log(Fraction);

class RecipeView extends View {
  // private properties
  _parentElement = document.querySelector('.recipe');
  _errorMsg = `Could not find recipe with id ${window.location.hash.slice(1)}, try again!`
  _message = '';
  
  

  // publisher
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));
    // console.log('ciao');
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--update-servings');
      if(!btn) return;
      const {updateTo} = btn.dataset;
      
      if(updateTo > 0) handler(+updateTo);
    })
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', function(e) {
      /* Use case for event delegation: 
      by the time the page is loaded, the element with class btn--bookmark does not exist yet.
      So we can't add an event listener!
      */
     const btn = e.target.closest('.btn--bookmark');
     if(!btn) return;
     handler();
    })
  }
  
  _generateMarkup() {
    try {
      // console.log(_data);
      return `
          <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${
        this._data.title
      }" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this._data.title}</span>
            </h1>
          </figure>
  
          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.cookingTime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people">${
                this._data.servings
              }</span>
              <span class="recipe__info-text">servings</span>
  
              <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                  <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                  </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                  <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                  </svg>
                </button>
              </div>
            </div>
  
            <div class="recipe__user-generated">
            </div>
            <button class="btn--round btn--bookmark">
              <svg class="">
                <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
              </svg>
            </button>
          </div>
  
          <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
  
              ${this._data.ingredients
                .map(this._generateMarkupIngredient)
                .join('')}
            </ul>
          </div>
  
          <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__publisher">${
                this._data.publisher
              }</span>. Please check out
              directions at their website.
            </p>
            <a
              class="btn--small recipe__btn"
              href="${this._data.sourceUrl}"
              target="_blank"
            >
              <span>Directions</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
        `;
    } catch (err) {
      console.error(`${err.message} 💩`);
    }
  }

  _generateMarkupIngredient(ing) {
    return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                !ing.quantity
                  ? ''
                  : new Fraction(ing.quantity.toFixed(1)).toString() // fractional library, see doc on npmjs
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${!ing.unit ? '' : ing.unit}</span>
                ${ing.description}
              </div>
            </li>
        `;
  }
}

export default new RecipeView();
