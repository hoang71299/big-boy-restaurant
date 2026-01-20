"use client";

import { useSetTokenToCookieMutation } from "@/app/queries/useAuth";
import { useAppStore } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { decode } from "punycode";
import { useEffect, useRef } from "react";

export default function OAuthPage() {
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const { mutateAsync } = useSetTokenToCookieMutation();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");
  const router = useRouter();
  const count = useRef(0);
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        setRole(role);
        setSocket(generateSocketInstance(accessToken));
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast({
              description: e.message || "Something went wrong",
            });
          });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({
            description: message || "Something went wrong",
          });
        });
        count.current++;
        router.push("/login");
      }
    }
  }, [accessToken, refreshToken, setRole, setSocket, router, message]);
  return null;
}
