import axios from './axios.customize'

interface Food {
    _id:string,
    name: string,
    category : [string],
    description: string,
    calories: number,
    protein: number,
    fat: number,
    carbs: number,
    unit: string,
    weight: number,
    image: string,
}

const getFoodApi = async (): Promise<Food[]> => { // get all food
    const URL_API = "api/food/get";
    return await axios.get(URL_API);
}

const getFoodByNameApi = async (name: string): Promise<Food[]> => { // get food by name
    const URL_API = "api/food/get/name";
    const params = { name: name };
    return await axios.get(URL_API, { params });
}


export {
    getFoodApi,getFoodByNameApi 
}