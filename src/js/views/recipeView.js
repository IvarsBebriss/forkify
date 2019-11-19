import { elements } from './base';
import { Fraction } from 'fractional';
import fracty from 'fracty';

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

const formatCount = count => {
    if (count){
        // const int = Math.floor(count);
        // if(int === count || count - int < 0.001 || count < int) return Math.round(count);
        // if(count - int > 0.99) return Math.round(count);
        // const fr = new Fraction(count - int);
        // return `${int ? `${int} `:``}${fr.numerator}/${fr.denominator}`;
        return `${fracty(count)}`; 
    }
    return '?';
}

export const renderRecipe = (recipe, isLiked) => {
    
    const createIngredient = (e) => {
        return `<li class="recipe__item">
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${formatCount(e.count)}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${e.unit}</span>
                ${e.ingredient}
            </div>
        </li>`
    };

    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>
            </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map( e => createIngredient(e)).join('')}
                </ul>

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </a>
            </div>
    `;
    elements.recipe.innerHTML = markup;
};

export const updateIngredients = recipe => {
    //update servings
    document.querySelector('.recipe__info-data--people').innerHTML = recipe.servings;
    //update ingrediants quantities

    const arrElements = Array.from(document.querySelectorAll('.recipe__count'));
    arrElements.forEach((e, i) => {
        e.textContent = formatCount(recipe.ingredients[i].count);
    });

};