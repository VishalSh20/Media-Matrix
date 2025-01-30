import axios from "axios";
import axiosRetry from "axios-retry";
export const api = axios.create();
axiosRetry(api, { 
    retries: 3,
    retryDelay: (retryCount) => {
        console.log(`Retry attempt ${retryCount}`);
        return retryCount * 2000; 
    }
 });