import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { user } from "@/models/auth-schema";
import { profile } from "@/models/profile";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        const loginUser = session?.user?.id;

        if (!loginUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userProfile = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.image,
                role: profile.role,
                approval: profile.approval,
                createdAt: profile.createdAt,
            })
            .from(user)
            .leftJoin(profile, eq(user.id, profile.userId))
            .where(eq(user.id, loginUser))

        if (userProfile.length === 0) {
            return NextResponse.json(
                { error: "User Profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(userProfile[0], { status: 200 });
    } catch (error) {
        console.error("Failed to fetch profile:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
