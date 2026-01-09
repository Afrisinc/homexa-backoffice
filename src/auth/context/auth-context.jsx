import { createContext } from 'react';

// ----------------------------------------------------------------------

export const AuthContext = createContext({
  user: null,
  checkUserSession: async () => {},
  logout: () => {},
  loading: false,
  authenticated: false,
  unauthenticated: true,
});
