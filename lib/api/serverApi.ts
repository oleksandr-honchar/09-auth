"use server"

import { cookies } from "next/headers";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import { nextServer } from "./api"; 
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

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


export const checkSession = async (): Promise<AxiosResponse<unknown>> => {
  return serverGet("/auth/session");
};


export const getUserProfile = () => serverGet<User>("/users/me");

export const getNoteById = (id: string): Promise<Note> =>
  serverGet<Note>(`/notes/${id}`);

export const getNotes = ({
  page,
  perPage,
  search,
  tag,
}: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}) => {
  return serverGet("/notes", { params: { page, perPage, search, tag } });
};

export const getServerMe = async (): Promise<User | null> => {
  try {
    return await serverGet<User>("/users/me");
  } catch {
    return null;
  }
};

