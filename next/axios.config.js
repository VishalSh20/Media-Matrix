import axios from "axios";

const options = {
    baseURL: process.env.LAMBDA_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
}
const lambdaApi = axios.create(options);
console.log(lambdaApi.defaults.baseURL);

const baseApi = axios.create({
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
    },
});

export {lambdaApi,baseApi};