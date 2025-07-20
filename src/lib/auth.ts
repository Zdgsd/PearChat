// IMPORTANT: This is a mock authentication system using localStorage.
// It is NOT secure and should NOT be used in a production environment.
// Passwords are stored in plaintext. This is for demonstration only.

const USERS_KEY = "p2p_chat_users";
const CURRENT_USER_KEY = "p2p_chat_current_user";
const ADMIN_USER_KEY = "p2p_admin_user";

const getStoredUsers = (): Map<string, string> => {
  if (typeof window === "undefined") return new Map();
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? new Map(JSON.parse(usersJson)) : new Map();
};

const setStoredUsers = (users: Map<string, string>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(Array.from(users.entries())));
};

export const register = (username: string, password: string): void => {
  const users = getStoredUsers();
  if (users.has(username)) {
    throw new Error("Username already exists.");
  }
  users.set(username, password); // In a real app, hash the password
  setStoredUsers(users);
};

export const login = (username: string, password: string): boolean => {
  const users = getStoredUsers();
  if (users.has(username) && users.get(username) === password) {
    if (typeof window === "undefined") return false;
    localStorage.setItem(CURRENT_USER_KEY, username);
    localStorage.removeItem(ADMIN_USER_KEY);
    return true;
  }
  return false;
};

export const adminLogin = (username: string, password: string): boolean => {
  if (username === "a" && password === "a") {
    if (typeof window === "undefined") return false;
    localStorage.setItem(ADMIN_USER_KEY, username);
    localStorage.removeItem(CURRENT_USER_KEY);
    return true;
  }
  return false;
}

export const logout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};

export const getCurrentUser = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_USER_KEY);
};

export const getAdminUser = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_USER_KEY);
};

export const isAuthenticated = (): boolean => {
    return !!getCurrentUser() || !!getAdminUser();
}
