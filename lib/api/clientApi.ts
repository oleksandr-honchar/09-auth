import { nextServer, ApiError } from "./api";
import type { User } from "@/types/user";

export interface RegisterRequest { email: string; password: string }
export interface LoginRequest { email: string; password: string }

export const login = async (email: string, password: string): Promise<User> => {
  const res = await nextServer.post("/auth/login", { email, password });
  return res.data.user; 
};

export const register = async (payload: RegisterRequest): Promise<User> => {
  const res = await nextServer.post("/auth/register", payload);
  return res.data.user;
};

export const logout = async (): Promise<void> => {
  try {
    await nextServer.post("/auth/logout");
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Logout failed");
  }
};

export const fetchUserProfile = async (): Promise<User> => {
  const res = await nextServer.get("/users/me");
  return res.data;
};

export const updateUserProfile = async (payload: Partial<User>): Promise<User> => {
  try {
    const { data } = await nextServer.patch<User>("/users/me", payload);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Update user failed");
  }
};


export const checkSession = async (): Promise<{ accessToken?: string }> => {
  try {
    const res = await nextServer.get("/auth/session"); 
    return res.data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Session check failed");
  }
};
