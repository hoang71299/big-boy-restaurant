"use client";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
const UNAUTHENTICATED_PATHS = ["/login", "/logout", "refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  console.log(pathname);
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) {
      return;
    }
    let interval: any = null;

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    const TiMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TiMEOUT); //check every 1 second
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
}
