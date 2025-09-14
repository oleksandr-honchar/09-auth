import { nextServer as api, ApiError } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// -------- AUTH --------
export interface RegisterRequest { email: string; password: string }
export interface LoginRequest { email: string; password: string }

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data.user; // refreshToken stored in HttpOnly cookie
};

export const register = async (payload: { email: string; password: string }) => {
  const res = await api.post("/auth/register", payload);
  return res.data.user;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Logout failed");
  }
};

export const fetchUserProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const updateUserProfile = async (payload: Partial<User>): Promise<User> => {
  try {
    const { data } = await api.patch<User>("/users/me", payload);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Update user failed");
  }
};

export const checkSession = async () => {
  const res = await api.post("/auth/refresh"); // browser sends refreshToken automatically
  return res.data; // { accessToken }
};

// -------- NOTES --------
export type FetchNotesParams = {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {
    const { data } = await api.get<FetchNotesResponse>("/notes", { params });
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Fetch notes failed");
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Fetch note failed");
  }
};

// lib/api/clientApi.ts

export type CreateNotePayload = {
  title: string;
  content: string;
  tag: string;
};

// create note
export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  try {
    const { data } = await api.post<Note>("/notes", payload);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Create note failed");
  }
};

// update note
export const updateNote = async (id: string, payload: Partial<CreateNotePayload>): Promise<Note> => {
  try {
    const { data } = await api.patch<Note>(`/notes/${id}`, payload);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Update note failed");
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Delete note failed");
  }
};
