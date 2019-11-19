import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

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
            const isLiked = state.likes ? state.likes.isLiked(id) : false;
            recipeView.renderRecipe(state.recipe, isLiked);
            //searchView.renderResults(state.search.result, 1);
        } catch (error){
            console.log(error);
            alert('Something went wrong :(');
            clearLoader();
        };
    };
};

['hashchange', 'load'].forEach(e => window.addEventListener(e,controllRecipe));

/** 
 * List controller
 */

const controllList = () => {
    //create a new list if there is none
    if (!state.list) state.list = new List();
    //add ingredients to list and UI
    state.recipe.ingredients.forEach( el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);       
    listView.renderItem(item);
});
}

/**
 * LIKES controller
 */

const controllLikes = () => {
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    if (!state.likes.isLiked(currentId)){
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentId);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentId);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('minus');
            recipeView.updateIngredients(state.recipe);
        };
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('plus');
        recipeView.updateIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controllList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        controllLikes();
    }
});

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach( el => likesView.renderLike(el));
});
