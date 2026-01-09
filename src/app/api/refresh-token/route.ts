import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";
import { error } from "console";
export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json({
      message: "Khong tim thay refresh Token"
    })
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken
    })
    const decodeAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
    const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }
    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeAccessToken.exp * 1000
    })
    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    })
    return Response.json(payload);
  } catch (err: any) {
    console.log(err);
    if (err instanceof HttpError) {
      return Response.json(err.payload, {
        status: err.status
      })
    } else {
      return Response.json({ message: err.message ?? "Có lỗi xảy ra" }, { status: 401 })
    }
  }
}
