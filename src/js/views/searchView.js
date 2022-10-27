import View from "./View";

class SearchView extends View {
    _parentElement = document.querySelector('.search');

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
            // clearInput();
        })
    }
}

export default new SearchView();