import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * Global state of the app
 * - Search object
 * - current recipe
 * - shopping list object
 * - liked recipes
 **/
const state = {};

/** search controller */
const controllSearch = async () => {
    //get query from view
    const query = searchView.getInput();
    if (query){
        //new search object and add to state
        state.search = new Search(query);
        //prepare UI for search results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // do the search
        try {
            await state.search.getResults();   
            // display the results on UI
            clearLoader();
            searchView.renderResults(state.search.result, 1);
        } catch (error){
            console.log(error);
            alert('Something went wrong!');
            clearLoader();
        };
    };
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});

elements.resultsPages.addEventListener('click', e=> {
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    };
});

/** recipe controll */
const controllRecipe = async () => {
    const id = window.location.hash.replace('#','');
    if (id) {
        //prepare UI for recipe
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //new recipe object and add to state
        state.recipe = new Recipe(id);
        // get the recipe
        try {
            if (state.search) searchView.highlightSelected(id);
            await state.recipe.getRecipe();
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();
            // display the recipe on UI
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            //searchView.renderResults(state.search.result, 1);
        } catch (error){
            console.log(error);
            alert('Something went wrong :(');
            clearLoader();
        };
    };
};

['hashchange', 'load'].forEach(e => window.addEventListener(e,controllRecipe));

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if (state.recipe.servings > 1) state.recipe.updateServings('minus');
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('plus');
    }
    recipeView.updateIngredients(state.recipe);
});