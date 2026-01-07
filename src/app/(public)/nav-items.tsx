"use client";

import authApiRequest from "@/apiRequests/auth";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired = undefined, luôn hiển thị
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true, // Chỉ hiển thị khi người dùng đã đăng nhập
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Chỉ hiển thị khi người dùng chưa đăng nhập
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Chỉ hiển thị khi người dùng đã đăng nhập
  },
];
export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, []);
  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    ) {
      return null;
    }
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
