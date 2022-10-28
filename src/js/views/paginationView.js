import View from './View';
import icons from '../../img/icons.svg';
import leftArrow from '../../img/left-arrows-couple-svgrepo-com.svg';
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
    const pageNumber = Math.ceil(
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
    const first = `
        <button data-goto="1" class="btn--inline pagination__btn--first">
        <span><<</span>
        </button>
        `;
    const last = `
        <button data-goto="${pageNumber}" class="btn--inline pagination__btn--last">
            <span>>></span>
        </button>
        `;
    ///////// Different  scenarios
    // Page 1, and there are other pages
    if (currentPage === 1 && pageNumber > 1) return `<span>${last + next} </span>`;

    // Last page
    if (currentPage === pageNumber && pageNumber > 1) return `<span>${first + previous}</span>`;

    // Other page
    if (currentPage < pageNumber) return `<span>${first + previous + last + next }</span>`;

    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
