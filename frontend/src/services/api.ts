import axios from 'axios';
import { Business } from '../types/business';

const API_URL = 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Business API calls
export const getBusinesses = async (
  page = 1, 
  limit = 10, 
  searchTerm?: string,
  category?: string
): Promise<{ 
  businesses: Business[],
  count: number,
  pages: number 
}> => {
  try {
    let url = `/businesses?page=${page}&limit=${limit}`;
    
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    const response = await api.get(url);
    
    // If search term is provided, filter results on the client side
    // since our backend doesn't directly support search by name
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      const filteredBusinesses = response.data.data.filter((business: Business) => 
        business.businessName.toLowerCase().includes(term) || 
        business.description.toLowerCase().includes(term)
      );
      
      return {
        businesses: filteredBusinesses,
        count: filteredBusinesses.length,
        pages: 1 // Client-side filtering doesn't support pagination
      };
    }
    
    return {
      businesses: response.data.data,
      count: response.data.count,
      pages: response.data.pages
    };
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return { businesses: [], count: 0, pages: 0 };
  }
};

export const getBusiness = async (id: string): Promise<Business | null> => {
  try {
    const response = await api.get(`/businesses/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching business with id ${id}:`, error);
    return null;
  }
};

// Admin Authentication
export interface AdminRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminData {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export const registerAdmin = async (data: AdminRegisterData): Promise<AdminData> => {
  const response = await api.post('/auth/register', data);
  return response.data.data;
};

export const loginAdmin = async (data: AdminLoginData): Promise<AdminData> => {
  const response = await api.post('/auth/login', data);
  return response.data.data;
};

export const getAdminProfile = async (): Promise<Omit<AdminData, 'token'>> => {
  const response = await api.get('/auth/profile');
  return response.data.data;
};

// Admin business operations
export const createBusiness = async (formData: FormData): Promise<Business> => {
  const response = await api.post('/businesses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const updateBusiness = async (id: string, formData: FormData): Promise<Business> => {
  const response = await api.put(`/businesses/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const deleteBusiness = async (id: string): Promise<void> => {
  await api.delete(`/businesses/${id}`);
};

export default api; 