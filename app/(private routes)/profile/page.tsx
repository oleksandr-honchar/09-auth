"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import css from "./ProfilePage.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
      } catch {
        clearAuth();
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    if (!user) loadUser();
    else setLoading(false);
  }, [user, setUser, clearAuth, router]);

  if (loading || !isAuthenticated) return <p>Loading profile...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <button className={css.editProfileButton} onClick={() => router.push("/profile/edit")}>
            Edit Profile
          </button>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar ?? "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
