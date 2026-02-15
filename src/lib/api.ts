/**
 * API Client Library
 * Centralized API calls for all endpoints using axios instance
 */

import axiosInstance from './axios';

// API Endpoints
export const endpoints = {
  categories: {
    list: '/api/categories',
    details: '/api/categories/:id',
    create: '/api/categories',
    update: '/api/categories/:id',
    delete: '/api/categories/:id',
  },
  users: {
    list: '/api/users',
    details: '/api/users/:id',
    create: '/api/users',
    update: '/api/users/:id',
    delete: '/api/users/:id',
  },
  products: {
    list: '/api/products',
    details: '/api/products/:id',
    create: '/api/products',
    update: '/api/products/:id',
    delete: '/api/products/:id',
  },
  chats: {
    list: '/api/chats',
    details: '/api/chats/:id',
    updateStatus: '/api/chats/:id',
  },
};

// Helper function to replace ID in endpoint
const replaceId = (endpoint: string, id?: string): string => {
  if (!id) return endpoint;
  return endpoint.replace(':id', id);
};

// Categories API
export const categoriesAPI = {
  /**
   * Fetch all categories
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endpoints.categories.list);
      return response.data?.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Fetch a single category by ID
   */
  getById: async (id: string) => {
    try {
      const url = replaceId(endpoints.categories.details, id);
      const response = await axiosInstance.get(url);
      console.log('Fetched category data:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  /**
   * Create a new category
   */
  create: async (data: any) => {
    try {
      const response = await axiosInstance.post(endpoints.categories.create, data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update an existing category
   */
  update: async (id: string, data: any) => {
    try {
      const url = replaceId(endpoints.categories.update, id);
      const response = await axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Delete a category
   */
  delete: async (id: string) => {
    try {
      const url = replaceId(endpoints.categories.delete, id);
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

// Users API
export const usersAPI = {
  /**
   * Fetch all users
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endpoints.users.list);
      console.log('Fetched users data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Fetch a single user by ID
   */
  getById: async (id: string) => {
    try {
      const url = replaceId(endpoints.users.details, id);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  create: async (data: any) => {
    try {
      const response = await axiosInstance.post(endpoints.users.create, data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update an existing user
   */
  update: async (id: string, data: any) => {
    try {
      const url = replaceId(endpoints.users.update, id);
      const response = await axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete a user
   */
  delete: async (id: string) => {
    try {
      const url = replaceId(endpoints.users.delete, id);
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

// Sellers API
export const sellersAPI = {
  /**
   * Fetch sellers with pagination and search
   */
  getAll: async (page = 1, limit = 10, search = '') => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) {
        params.append('search', search);
      }
      const response = await axiosInstance.get(`/api/sellers?${params.toString()}`);
      return response.data?.data?.data || [];
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },
};

// Products API
export const productsAPI = {
  /**
   * Fetch all products
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endpoints.products.list);
      return response.data?.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Fetch a single product by ID
   */
  getById: async (id: string) => {
    try {
      const url = replaceId(endpoints.products.details, id);
      const response = await axiosInstance.get(url);
      return response.data?.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  /**
   * Create a new product
   */
  create: async (data: any) => {
    try {
      const response = await axiosInstance.post(endpoints.products.create, data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Update an existing product
   */
  update: async (id: string, data: any) => {
    try {
      const url = replaceId(endpoints.products.update, id);
      const response = await axiosInstance.patch(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  /**
   * Delete a product
   */
  delete: async (id: string) => {
    try {
      const url = replaceId(endpoints.products.delete, id);
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

// Chats API
export const chatsAPI = {
  /**
   * Fetch all chats
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endpoints.chats.list);
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  /**
   * Fetch a single chat by ID
   */
  getById: async (id: string) => {
    try {
      const url = replaceId(endpoints.chats.details, id);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  },

  /**
   * Update chat status
   */
  updateStatus: async (id: string, status: string) => {
    try {
      const url = replaceId(endpoints.chats.updateStatus, id);
      const response = await axiosInstance.patch(url, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating chat status:', error);
      throw error;
    }
  },
};

export default {
  endpoints,
  categoriesAPI,
  usersAPI,
  sellersAPI,
  productsAPI,
  chatsAPI,
};
