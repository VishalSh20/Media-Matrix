import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import axiosRetry from 'axios-retry';

console.log("NEXT_APP_URL:", process.env.NEXT_DEVELOPMENT_URL);
const nextApi = axios.create({
  baseURL: process.env.NEXT_DEVELOPMENT_URL,
});

axiosRetry(nextApi,{
  retries:3,
  retryCondition:(error) => {
    return error.response?.status === 429 || error.response?.status === 500;
  },
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
})

export default nextApi;