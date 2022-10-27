import View from './View';
import icons from '../../img/icons.svg';
import { _ } from 'core-js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // event listener => SUBSCRIBER
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
        // we listen to clicks on the parent element (btn--inline)
        const btn = e.target.closest('.btn--inline');
        // guard clause
        if(!btn) return;

        const goToPage = +btn.dataset.goto;
        // console.log(goToPage);
        
        handler(goToPage);

    })
  }

  _generateMarkup() {
    // page variable
    const currentPage = +this._data.page;

    return this._generateButton(currentPage);
  }

  // ########### CHALLENGE ###########
  // Refactor this code and encapsulate the generation of the markup for the buttons in a new method

  _generateButton(currentPage) {
    const numberPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numberPages);

    // we use the data attribute to access to the current page 'data-...' => we then use it in the handler
    const previous = `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        `;
    const next = `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    ///////// Different  scenarios
    // Page 1, and there are other pages
    if (currentPage === 1 && numberPages > 1) return next;

    // Last page
    if (currentPage === numberPages && numberPages > 1) return previous;

    // Other page
    if (currentPage < numberPages) return previous.concat(next);

    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
