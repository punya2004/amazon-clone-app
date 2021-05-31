import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/app-74e2a/us-central1/api' //the API(card function)URL
})

export default instance;