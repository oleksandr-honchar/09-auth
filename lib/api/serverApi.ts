"use server";

import { cookies } from "next/headers";
import type { AxiosRequestConfig } from "axios";
import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// ✅ Response type for session check
export interface SessionResponse {
  accessToken?: string;
  refreshToken?: string;
}

// Helper: build Cookie header from request cookies
async function getRequestCookieHeader(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    if (!all || all.length === 0) return undefined;
    return all.map((c) => `${c.name}=${c.value}`).join("; ");
  } catch {
    return undefined;
  }
}

// Low-level GET wrapper that forwards cookies
async function serverGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const cookieHeader = await getRequestCookieHeader();
  const res = await nextServer.get<T>(url, {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    withCredentials: true,
  });
  return res.data;
}

// =========================
// 🔒 AUTH / SESSION
// =========================
export const checkSession = async (): Promise<SessionResponse> => {
  return serverGet<SessionResponse>("/auth/session");
};

export const getUserProfile = async (): Promise<User> => {
  return serverGet<User>("/users/me");
};

export const getServerMe = async (): Promise<User | null> => {
  try {
    return await getUserProfile();
  } catch {
    return null;
  }
};

// =========================
// 📝 NOTES
// =========================
export const getNoteById = async (id: string): Promise<Note> => {
  return serverGet<Note>(`/notes/${id}`);
};

export interface GetNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface GetNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const getNotes = async ({
  page,
  perPage,
  search,
  tag,
}: GetNotesParams): Promise<GetNotesResponse> => {
  return serverGet<GetNotesResponse>("/notes", {
    params: { page, perPage, search, tag },
  });
};
