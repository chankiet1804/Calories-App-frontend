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

const getFoodApi = async (): Promise<Food[]> => {
    const URL_API = "api/food/get";
    return await axios.get(URL_API);
}

export {
    getFoodApi
}