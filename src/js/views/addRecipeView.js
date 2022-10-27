import View from './View';
import icons from '../../img/icons.svg';
import { _ } from 'core-js';
import { sendJSON } from '../helpers';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
    // for testing
    // Array.from(this._btnOpen.attributes).forEach(attr => console.log(attr.name, attr.value))
  }

  /**
   * The this keyword inside a handler function points to the element it is attached to => _btnOpen 
   * So we need to call the toggleWindow() method ^ and bind it to the correct element to function correctly
   */
  _addHandlerShowModal() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    // test log
    
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function(ev) {
        ev.preventDefault();
        
        // Form data
        // we pass in the FormData constructor a form object, in this case the this keyword points to _parentElement (the entire upload form)
        const dataArray = [...new FormData(this)];
        // method to convert arrays to objects
        const data = Object.fromEntries(dataArray);
        handler(data);
        // console.log(data);
    })
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
