/**
 * API Configuration
 * Central place to manage the backend API base URL
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://foodwaste-1.onrender.com';

console.log('🔗 API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  PING: `${API_BASE_URL}/api/auth/ping`,

  // Food
  DONATE_FOOD: `${API_BASE_URL}/api/food/donate`,
  ADD_FOOD: `${API_BASE_URL}/api/food/addFood`,
  GET_ALL_FOODS: `${API_BASE_URL}/api/food/all`,

  // NGO
  GET_NGOS_BY_LOCATION: (location) => `${API_BASE_URL}/api/ngo/${location}`,
  GET_ALL_NGOS: `${API_BASE_URL}/api/ngo/all`,
};

export default API_BASE_URL;
