import axios from 'axios';
import { api } from '../config';

export default class Search{
    
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try{
            //const proxy = 'https://cors-anywhere.herokuapp.com/';
            //const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            const res = await axios(`${api}search?q=${this.query}`);
            this.result = res.data.recipes;
            return this.result;
        } catch (error){
            alert(error);
        }
        
    }
}