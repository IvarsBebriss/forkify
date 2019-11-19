import axios from 'axios';
import { api } from '../config';

export default class Search{
    
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`${api}get?rId=${this.id}`);
            const result = res.data.recipe;
            this.title = result.title;
            this.author = result.publisher;
            this.image = result.image_url;
            this.url = result.source_url;
            this.ingredients = result.ingredients;
        } catch (error){
            console.log(error)
            alert('Something went wrong :(');
        }
    }

    calcTime(){
        //calculate the prep time assuming 3 ingredients take 15mins
        const periods = Math.ceil(this.ingredients.length / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients() {
        const unintsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const units = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'kg', 'g', 'l', 'ml'];
        const newIngredients = this.ingredients.map(el => {
            // uniform units
            let ingredient = el.toLowerCase();
            unintsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            });
            // noņem iekavas
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // parse ingredients
            const arrIng = ingredient.split(' ');
            const unitPos = arrIng.findIndex(el2 => units.includes(el2));

            let objIng = {
                count: 1,
                unit: '',
                ingredient : ''
            };
            if (unitPos > -1) {
                //there is a unit
                const arrCount = arrIng.slice(0, unitPos);
                if (arrCount.length === 0){
                    objIng.count = eval(arrIng[0].replace('-','+'));
                } else {
                    objIng.count = eval(arrIng.slice(0, unitPos).join('+'));
                };
                objIng.unit = arrIng[unitPos];
                objIng.ingredient = arrIng.slice(unitPos+1).join(' ');

            } else if (parseInt(arrIng[0],10)) {
                //there is no unit but is number in 1st pos
                objIng.count = parseInt(arrIng[0], 10);
                objIng.ingredient = arrIng.slice(1).join(' ');
            } else {
                //there is no unit and no number in 1st pos
                objIng.ingredient = ingredient;
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        const newServings = (type === 'plus' ? this.servings + 1 : this.servings - 1);
        
        this.ingredients.forEach( el => {
            el.count *= newServings / this.servings;
        });
        this.servings = newServings;
    }
}