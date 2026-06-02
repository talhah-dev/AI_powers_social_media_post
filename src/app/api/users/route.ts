import { db } from "@/db/drizzle";
import { user } from "@/models/auth-schema";
import { profile } from "@/models/profile";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const allUsers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: profile.role,
      approval: profile.approval,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .leftJoin(profile, eq(profile.userId, user.id));

  return NextResponse.json(allUsers);
}
