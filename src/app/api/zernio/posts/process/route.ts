import { db } from "@/db/drizzle";
import { post } from "@/models/post";
import { and, eq, lte } from "drizzle-orm";

const ZERNIO_API_BASE_URL =
  process.env.ZERNIO_API_BASE_URL ?? "https://zernio.com/api/v1";
const ZERNIO_API_KEY = process.env.ZERNIO_API;
const ZERNIO_INSTAGRAM_ACCOUNT_ID = process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PostType = "feed" | "story" | "reel";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return processScheduledPosts();
}

export async function POST() {
  return processScheduledPosts();
}

async function processScheduledPosts() {
  if (!ZERNIO_API_KEY || !ZERNIO_INSTAGRAM_ACCOUNT_ID) {
    return Response.json(
      { ok: false, error: "Missing Zernio credentials in .env" },
      { status: 500 },
    );
  }

  const duePosts = await db
    .select()
    .from(post)
    .where(and(eq(post.status, "scheduled"), lte(post.scheduledFor, new Date())));

  let publishedCount = 0;
  let failedCount = 0;

  for (const item of duePosts) {
    const payload = {
      content: item.content,
      mediaItems: item.mediaUrl
        ? [
            {
              type: inferMediaType(item.mediaUrl, item.postType as PostType),
              url: item.mediaUrl,
            },
          ]
        : [],
      platforms: [
        {
          platform: "instagram",
          accountId: ZERNIO_INSTAGRAM_ACCOUNT_ID,
          ...(item.postType === "story"
            ? { platformSpecificData: { contentType: "story" } }
            : item.postType === "reel"
              ? {
                  platformSpecificData: {
                    contentType: "reels",
                    shareToFeed: true,
                  },
                }
              : {}),
        },
      ],
      publishNow: true,
    };

    try {
      const response = await fetch(`${ZERNIO_API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ZERNIO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      const parsed = safeJsonParse(text);

      await db
        .update(post)
        .set({
          status: response.ok ? "published" : "failed",
          zernioPostId: parsed?.id ? String(parsed.id) : item.zernioPostId,
          errorMessage: response.ok ? null : parsed?.error ?? text,
          updatedAt: new Date(),
        })
        .where(eq(post.id, item.id));

      if (response.ok) {
        publishedCount += 1;
      } else {
        failedCount += 1;
      }
    } catch (error: any) {
      await db
        .update(post)
        .set({
          status: "failed",
          errorMessage: error?.message ?? "Failed to publish scheduled post",
          updatedAt: new Date(),
        })
        .where(eq(post.id, item.id));

      failedCount += 1;
    }
  }

  return Response.json({
    ok: true,
    processed: duePosts.length,
    publishedCount,
    failedCount,
  });
}

function inferMediaType(url: string, postType: PostType) {
  if (postType === "reel" || /\.(mp4|mov|webm)(\?|#|$)/i.test(url)) {
    return "video";
  }

  return "image";
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
