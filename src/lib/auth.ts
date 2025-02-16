import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "default-admin-password";

// Convert secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const generateToken = async (username: string) => {
  return await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1week")
    .sign(secretKey);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
};

export const validateCredentials = (username: string, password: string) => {
  return username === "admin" && password === ADMIN_PASSWORD;
};

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
};

export const isAuthenticated = async () => {
  const token = await getAuthToken();
  if (!token) return false;
  return (await verifyToken(token)) !== null;
};
