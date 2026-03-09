import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const analyzeTranscript = (data) => API.post('/analyze', data);

export default API;