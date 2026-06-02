import { db } from "@/db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as authSchema from "@/models/auth-schema";
import { profile } from "@/models/profile";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: authSchema,

    }),
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await db
                        .insert(profile)
                        .values({
                            userId: user.id,
                            role: "user",
                            approval: "pending",
                        })
                        .onConflictDoNothing();
                },
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }
    },
});
