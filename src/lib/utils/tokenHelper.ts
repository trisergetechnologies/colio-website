// tokenHelper.ts
import Cookies from "js-cookie";

const TOKEN_KEY = "accessToken";

// Save token
export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 15,          
    sameSite: "strict",
    path: "/",           // cookie available on all pages
  });
};

// Get token
export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) ?? null;
};

// Remove token
export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};
