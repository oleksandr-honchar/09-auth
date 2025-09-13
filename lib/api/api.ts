// shared axios instance for client-side
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., https://notehub-api.goit.study
  withCredentials: true, // required to send cookies
});

export type ApiError = AxiosError<{ error: string }>;

