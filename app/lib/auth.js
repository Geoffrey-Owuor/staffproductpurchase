//app/lib/auth.js
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Password Hashing (Node.js only)
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

//Create JWT and set it as httpOnly cookie
export const createSession = async (
  userId,
  role,
  name,
  email,
  payrollNo,
  department,
) => {
  const expiresAt = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  const token = await new SignJWT({
    userId,
    role,
    name,
    email,
    payrollNo,
    department,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 2 * 60 * 60, //2 hours
  });
};

//Verify JWT (returns user info or null)
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      valid: true,
      id: payload.userId,
      role: payload.role,
      name: payload.name,
      email: payload.email,
      payrollNo: payload.payrollNo,
      department: payload.department,
      expiresAt: payload.exp * 1000, // Convert to ms for JS
    };
  } catch {
    return { valid: false };
  }
};
