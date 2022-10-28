import icons from './../../img/icons.svg';

// Parent class of all views
export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render = true]
   * @returns {undefined | string} if render=false returns markup string
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    // when this condition is true render() returns the markup string and does NOT actually render it. The string then is passed as a parameter in _generateMarkup()
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Update only changed elements
   * @param {Object} data Data to be rendered or refreshed
   */
  update(data) {
    // this part is identical to render()

    this._data = data;
    const newMarkup = this._generateMarkup();

    // store DOM fragment in a variable
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // select all new elements from fragment and store in array
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    //same with current elements
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    // compare current and new Elements
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      // console.log(newEl.isEqualNode(curEl), newEl);

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // we need to check if the element to be updated contains only text before changing its content (otherwise it overwrites all the DOM node)
        curEl.textContent = newEl.textContent;
        // console.log('🌸', newEl.firstChild.nodeValue.trim());
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );

      // nodeValue => see mdn
    });
  }

  // Delete the hardcoded markup
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Render spinner
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;

    // this._parentElement.innerHTML = '';
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render error
  renderError(msg = this._errorMsg) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Render msg
  renderMessage(msg = this._message) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
