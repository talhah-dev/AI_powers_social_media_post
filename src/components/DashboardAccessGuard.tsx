"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

interface DashboardAccessGuardProps {
  children: React.ReactNode;
}

export function DashboardAccessGuard({ children }: DashboardAccessGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/user");

        if (!res.data) {
          toast.error("You are not logged in");
          router.push("/auth");
          return;
        }

        if (res.data.approval === "rejected") {
          toast.error("Your account has been rejected");
          router.replace("/auth");
          return;
        }

        if (res.data.approval === "pending") {
          toast.error("Your account is pending approval");
          router.replace("/pending-approve");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [router]);

  return <>{children}</>;
}
