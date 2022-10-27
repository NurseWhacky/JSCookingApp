import View from './View';
import previewView from './previewView';
import icons from './../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMsg = `No recipes found for your query, try again!`;
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(result => previewView.render(result, false))
      .join('');
  }
}

export default new ResultsView();
