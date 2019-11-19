import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () =>{
    elements.searchResList.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    
    document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active');
};

const limitString = (title, limit = 17) => {
    const newTitle = [];
    if (title.length <= limit) {
        return title;
    };
    title.split(' ').reduce( (acc,cur) => {
        if(acc + cur.length <= limit){
            newTitle.push(cur);
        }
        return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')}...`;
};


const renderRecipe = recipe => {
    
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitString(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend",markup);
};

const createButton = (page, type = 'next') => 
    `<button class="btn-inline results__btn--${type}" data-goto=${type === 'next' ? page+1 : page-1}>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
    </svg>
    <span>Page ${type === 'next' ? page+1 : page-1}</span>
    </button>
    `;

const renderButtons = (page, results, resPerPage) => {
    const pages = Math.ceil(results / resPerPage);
    let button = '';
    if (page === 1 && pages > 1) {
        button = createButton(1);
    } else if (page === pages && pages >1){
        button = createButton(pages, 'prev');
    } else {
        button = createButton(page, 'prev') + createButton(page);
    };
    elements.resultsPages.innerHTML = button;
};


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};