import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

export const saveTokens = async (token: string, refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    return (decoded.exp < currentTime);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    // Call your refresh token endpoint
    const response = await fetch('https://your-api.com/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      await clearTokens();
      return null;
    }

    const { token, refresh_token: newRefreshToken } = await response.json();
    await saveTokens(token, newRefreshToken || refreshToken);
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await clearTokens();
    return null;
  }
};

let sessionTimeout: NodeJS.Timeout;

export const resetSessionTimeout = (onTimeout: () => void) => {
  if (sessionTimeout) {
    clearTimeout(sessionTimeout);
  }

  sessionTimeout = setTimeout(() => {
    onTimeout();
    clearTokens();
  }, SESSION_TIMEOUT);
};

export const clearSessionTimeout = () => {
  if (sessionTimeout) {
    clearTimeout(sessionTimeout);
  }
};
