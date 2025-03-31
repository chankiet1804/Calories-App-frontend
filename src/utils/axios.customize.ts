import axios from "axios";
import { BACKEND_URL } from '@env';

const instance = axios.create({
    baseURL: BACKEND_URL
});

// // Add a request interceptor
// instance.interceptors.request.use(async function (config) {
//     //config.defaults.headers.common['Authorization'] = "HOIDANIT_TOKEN";
//     const token = await AsyncStorage.getItem("access_token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, function (error) {
//     return Promise.reject(error);
// });


// Add a response interceptor
instance.interceptors.response.use(function (response) {
    if (response && response.data) return response.data; // chinh chi lay ra data cua response
    return response; // neu khong co data thi tra ve toan bo response
}, function (error) {
    if (error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
});

export default instance;