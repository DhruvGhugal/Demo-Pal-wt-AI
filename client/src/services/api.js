/**
 * API Service - All backend communication centralized here
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('authToken');
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },

  // Login user
  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  // Logout
  logout: () => {
    removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// ============================================
// USER PROFILE API
// ============================================

export const profileAPI = {
  // Update profile
  updateProfile: async (profileData) => {
    return await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// ============================================
// SETTINGS API
// ============================================

export const settingsAPI = {
  // Get settings
  getSettings: async () => {
    return await apiRequest('/settings');
  },

  // Update settings
  updateSettings: async (settings) => {
    return await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// ============================================
// POSTURE SESSIONS API
// ============================================

export const sessionsAPI = {
  // Create new session
  createSession: async (sessionData) => {
    return await apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  // Get all sessions
  getAllSessions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/sessions?${queryString}`);
  },

  // Get single session
  getSession: async (sessionId) => {
    return await apiRequest(`/sessions/${sessionId}`);
  },

  // Delete session
  deleteSession: async (sessionId) => {
    return await apiRequest(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Get sessions by date range
  getSessionsByDateRange: async (startDate, endDate) => {
    return await apiRequest(`/sessions/range/${startDate}/${endDate}`);
  },

  // Get user statistics
  getStats: async () => {
    return await apiRequest('/stats');
  },

  // Delete all data
  deleteAllData: async () => {
    return await apiRequest('/data', {
      method: 'DELETE',
    });
  },
};

// ============================================
// EXPORT ALL APIs
// ============================================

const api = {
  auth: authAPI,
  profile: profileAPI,
  settings: settingsAPI,
  sessions: sessionsAPI,
};

export default api;
