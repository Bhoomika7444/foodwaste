/**
 * API Service Utility
 * Handles all backend API requests
 */

import { API_ENDPOINTS } from '../config/api';

class APIService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  register(data) {
    return this.request(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  login(data) {
    return this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  ping() {
    return this.request(API_ENDPOINTS.PING);
  }

  // Food endpoints
  donateFood(data) {
    return this.request(API_ENDPOINTS.DONATE_FOOD, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getAllFoods() {
    return this.request(API_ENDPOINTS.GET_ALL_FOODS);
  }

  // NGO endpoints
  getNgosByLocation(location) {
    return this.request(API_ENDPOINTS.GET_NGOS_BY_LOCATION(location));
  }

  getAllNgos() {
    return this.request(API_ENDPOINTS.GET_ALL_NGOS);
  }
}

export default new APIService();
