import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { profile } from "@/models/profile";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminProfile = await db
            .select()
            .from(profile)
            .where(eq(profile.userId, session.user.id))
            .limit(1)
            .then((rows) => rows[0] ?? null);

        // adminProfile :  {
        //     id: 1,
        //     userId: 'G5GUCaISl72l0PoLejLscKCw2GRVe8Ru',
        //     role: 'user',
        //     approval: 'pending',
        //     createdAt: 2026-06-01T09:05:33.741Z,
        //     updatedAt: 2026-06-01T09:05:33.741Z
        //  }


        // const adminProfile = (
        //     await db
        //         .select()
        //         .from(profile)
        //         .where(eq(profile.userId, session.user.id))
        //         .limit(1)
        // )[0] ?? null;

        if (adminProfile?.role !== "admin") {
            return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json().catch(() => null);
        const userId = body?.userId as string | undefined;
        const approval = body?.approval as string | undefined;
        const role = body?.role as string | undefined;

        if (!userId || (!role && !approval)) {
            return Response.json(
                { error: "userId and at least one field (role or approval) are required" },
                { status: 400 }
            );
        }

        const updateData: {
            role?: string;
            approval?: string;
            updatedAt: Date;
        } = {
            updatedAt: new Date(),
        };

        if (role) updateData.role = role;
        if (approval) updateData.approval = approval;

        const updatedProfile = await db
            .update(profile)
            .set(updateData)
            .where(eq(profile.userId, userId))
            .returning();

        if (updatedProfile.length === 0) {
            return Response.json({ error: "Profile not found" }, { status: 404 });
        }

        return Response.json({
            ok: true,
            profile: updatedProfile[0],
        });
    } catch (error) {
        console.error("verify-user role update error:", error);
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
