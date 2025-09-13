// lib/api/api.ts
import axios, { AxiosError } from "axios";

// Client-side & SSR API instance with cookies support
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Shared error type for catching API errors
export type ApiError = AxiosError<{ error: string }>;
