"use server";

import db from "./db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import crypto from "crypto";

const AuthSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginOrRegister(formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  const parsed = AuthSchema.safeParse({ phone, password });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone) as any;

  let userId;

  if (user) {
    // Login
    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) return { error: "Invalid credentials." };
    userId = user.id;
  } else {
    // Register
    userId = crypto.randomUUID();
    const hash = bcrypt.hashSync(password, 10);
    db.prepare("INSERT INTO users (id, phone, password_hash) VALUES (?, ?, ?)").run(userId, phone, hash);
  }

  // Create session
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(sessionId, userId, expiresAt.toISOString());

  (await cookies()).set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return { success: true };
}
