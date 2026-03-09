/**
 * API Service Utility
 * Handles all backend API requests with proper error handling
 */

import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL from '../config/api';

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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

  // Food update endpoint
  updateFood(foodId, donorName) {
    const url = API_ENDPOINTS.GET_ALL_FOODS.replace('/all', '') + `/${foodId}`;
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify({ donorName }),
    });
  }

  // Admin endpoints
  requestAdminAccess(userId) {
    return this.request(`${API_BASE_URL}/api/auth/request-admin`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  getPendingAdminRequests() {
    const userId = localStorage.getItem('fw_user') ? JSON.parse(localStorage.getItem('fw_user')).id : null;
    return this.request(`${API_BASE_URL}/api/admin/requests`, {
      method: 'GET',
      headers: { 'user-id': userId },
    });
  }

  approveAdminRequest(userId) {
    const currentUser = localStorage.getItem('fw_user') ? JSON.parse(localStorage.getItem('fw_user')) : null;
    return this.request(`${API_BASE_URL}/api/admin/approve/${userId}`, {
      method: 'POST',
      headers: { 'user-id': currentUser?.id || '' },
    });
  }

  rejectAdminRequest(userId) {
    const currentUser = localStorage.getItem('fw_user') ? JSON.parse(localStorage.getItem('fw_user')) : null;
    return this.request(`${API_BASE_URL}/api/admin/reject/${userId}`, {
      method: 'POST',
      headers: { 'user-id': currentUser?.id || '' },
    });
  }

  getDashboardStats() {
    return this.request(`${API_BASE_URL}/api/admin/dashboard`);
  }
  getNgosByLocation(location) {
    return this.request(API_ENDPOINTS.GET_NGOS_BY_LOCATION(location));
  }

  getAllNgos() {
    return this.request(API_ENDPOINTS.GET_ALL_NGOS);
  }
}

export default new APIService();
