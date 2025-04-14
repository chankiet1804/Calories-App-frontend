import axios from './axios.customize'
import { Food,Meal } from '../types/type'

const getFoodApi = async (): Promise<Food[]> => { // get all food
    const URL_API = "api/food/get";
    return await axios.get(URL_API);
}

const getFoodByNameApi = async (name: string): Promise<Food[]> => { // get food by name
    const URL_API = "api/food/get/name";
    const params = { name: name };
    return await axios.get(URL_API, { params });
}

const createMealApi = async (meal: Meal): Promise<Meal> => { 
    const URL_API = "api/meal/create";
    return await axios.post(URL_API, meal);
}


const getMealByDateApi = async (date:string ,userID: string): Promise<Meal[]> => { // get meal by day and userID
    // date format: YYYY-MM-DD
    const URL_API = "api/meal/get/date";
    const params = { date: date, userID: userID };
    return await axios.get(URL_API, { params });
}


export {
    getFoodApi,getFoodByNameApi,createMealApi,getMealByDateApi
}