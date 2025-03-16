// frontend/migration_frontend/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

export const fetchCountries = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}countries/`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        return [];
    }
};

export const fetchCities = async (countryId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}cities/?country=${countryId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch cities:', error);
        return [];
    }
};
