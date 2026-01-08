import { createContext } from 'react';

// ----------------------------------------------------------------------

export const AuthContext = createContext({
  user: null,
  checkUserSession: async () => {},
  loading: false,
  authenticated: false,
  unauthenticated: true,
});
