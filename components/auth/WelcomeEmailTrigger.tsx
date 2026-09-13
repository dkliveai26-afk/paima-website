"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function WelcomeEmailTrigger() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const sessionKey = `paima_welcome_checked_${user.id}`;
    if (sessionStorage.getItem(sessionKey)) return;

    sessionStorage.setItem(sessionKey, "true");

    fetch("/api/auth/welcome-check", { method: "POST" }).catch((err) => {
      console.warn("Welcome check trigger notice:", err);
    });
  }, [isSignedIn, user]);

  return null;
}
