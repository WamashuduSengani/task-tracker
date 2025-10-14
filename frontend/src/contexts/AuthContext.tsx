import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthContextType, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = authService.getStoredToken();

      if (storedToken) {
        authService.setAuthToken(storedToken);

        const mockUser: User = {
          id: 0,
          username: 'User',
          email: '',
          role: 'USER'
        };

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: mockUser,
            token: storedToken,
          },
        });
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      authService.clearTokens();
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener('auth-error', handleAuthError as EventListener);

    return () => {
      window.removeEventListener('auth-error', handleAuthError as EventListener);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const authResponse = await authService.login(credentials);
      authService.saveTokens(authResponse.accessToken, authResponse.refreshToken);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: authService.extractUserFromAuthResponse(authResponse),
          token: authResponse.accessToken,
        },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const authResponse = await authService.register(userData);
      authService.saveTokens(authResponse.accessToken, authResponse.refreshToken);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: authService.extractUserFromAuthResponse(authResponse),
          token: authResponse.accessToken,
        },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    authService.clearTokens();
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue: AuthContextType = {
    user: state.user,
    token: state.token,
    login,
    register,
    logout,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};