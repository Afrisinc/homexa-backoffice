import axios from 'axios';

import { CONFIG } from '@/global-config';

// ----------------------------------------------------------------------

// Create axios instance lazily to ensure CONFIG is loaded before accessing it
let axiosInstance = null;

function getOrCreateAxiosInstance() {
  if (!axiosInstance) {
    const baseURL = CONFIG.serverUrl || '';
    axiosInstance = axios.create({ baseURL });
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
    );
  }
  return axiosInstance;
}

// Export a proxy that creates the instance on first method call
const handler = {
  get(target, prop, receiver) {
    // Return the method bound to the actual axios instance
    const instance = getOrCreateAxiosInstance();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
};

export default new Proxy({}, handler);

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: { me: '/users/profile', signIn: '/auth/login' },
  mail: { list: '/api/mail/list', details: '/api/mail/details', labels: '/api/mail/labels' },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  ai: { generate: '/ai/generate' },
  socialMedia: { userPosts: '/social-media/user/posts' },
};
