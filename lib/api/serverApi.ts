import { nextServer } from "./api"; // Axios instance for server-side
import type { User } from "@/types/user";


// ✅ Validate / refresh session via /auth/session
export const checkSession = async (): Promise<void> => {
  try {
    await nextServer.get("/auth/session"); // refreshes accessToken cookie if needed
  } catch {
    throw new Error("Session refresh failed");
  }
};

// ✅ Fetch the current user profile
export const getUserProfile = async (): Promise<User> => {
  const res = await nextServer.get("/users/me");
  return res.data;
};

// ✅ Example: get a note by ID
export const getNoteById = async (id: string) => {
  const res = await nextServer.get(`/notes/${id}`);
  return res.data;
};

// ✅ Example: get paginated notes
export const getNotes = async ({
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
  const res = await nextServer.get("/notes", {
    params: { page, perPage, search, tag },
  });
  return res.data;
};

// ✅ Optional helper for server components
export const getServerMe = async (): Promise<User | null> => {
  try {
    const res = await nextServer.get("/users/me");
    return res.data;
  } catch {
    return null;
  }
};
