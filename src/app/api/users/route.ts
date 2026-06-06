import { db } from "@/db/drizzle";
import { user } from "@/models/auth-schema";
import { profile } from "@/models/profile";
import { eq, sql } from "drizzle-orm";
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

  // Drizzle's built-in aggregate functions for counts
  const stats = await db
    .select({
      totalUsers: sql<number>`count(*)`,
      totalApproved: sql<number>`count(case when ${profile.approval} = 'approved' then 1 end)`,
      totalRejected: sql<number>`count(case when ${profile.approval} = 'rejected' then 1 end)`,
      totalPending: sql<number>`count(case when ${profile.approval} = 'pending' then 1 end)`,
    })
    .from(user)
    .leftJoin(profile, eq(profile.userId, user.id));

  return NextResponse.json({
    stats: {
      totalUsers: Number(stats[0].totalUsers),
      totalApproved: Number(stats[0].totalApproved),
      totalRejected: Number(stats[0].totalRejected),
      totalPending: Number(stats[0].totalPending),
    },
    users: allUsers,
  });
}