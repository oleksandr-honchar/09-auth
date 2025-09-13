import { cookies } from "next/headers";
import type { User } from "@/types/user";

export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieStore = cookies();
    const cookieString = cookieStore.toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "GET",
      headers: { Cookie: cookieString },
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as User;
    return data;
  } catch {
    return null;
  }
};
