
const BACKEND_URL =
  'https://live-workoutplatform-backend-production.up.railway.app';

const API_BASE_URL = `${BACKEND_URL}/api`;

class API {
  static async _handleResponse(response) {
    let result;

    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      if (response.status === 401) {
        auth.clearAuth();
        window.location.href = 'index.html';
        throw new Error('Session expired. Redirecting to login.');
      }

      throw new Error(result.message || 'Request failed');
    }

    return result;
  }

  // AUTH

  static async register(data) {
    return this.post('/auth/register', data);
  }

  static async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  static async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: auth.getAuthHeader()
      });

      return this._handleResponse(response);
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  }

  // POST request helper

  static async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return this._handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request helper

  static async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: auth.getAuthHeader()
      });

      return this._handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // PUT request helper

  static async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          ...auth.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return this._handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // DELETE request helper

  static async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: auth.getAuthHeader()
      });

      return this._handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // TRAINERS

  static async getTrainers() {
    return this.get('/trainers/gettrainers');
  }

  static async getTrainerById(trainerId) {
    return this.get(`/trainers/${trainerId}`);
  }

  static async getTrainerPlans(trainerId) {
    return this.get(`/trainers/${trainerId}/plans`);
  }

  // PLANS

  static async getAllPlans() {
    return this.get('/plans/getplans');
  }

  static async getPlan(planId) {
    return this.get(`/plans/${planId}`);
  }

  // CLIENT

  static async getProfile() {
    return this.get('/clients/profile');
  }

  static async updateProfile(data) {
    return this.put('/clients/profile', data);
  }

  static async updateSubscription(isSubscribed) {
    return this.put('/clients/subscription', { isSubscribed });
  }

  // HELPERS

  static getTrainerImageUrl(imagePath) {
    if (!imagePath) {
      return '';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    return `${BACKEND_URL}${imagePath}`;
  }
}