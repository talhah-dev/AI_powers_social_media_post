import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { post } from "@/models/post";
import { desc, eq, sql } from "drizzle-orm";

const ZERNIO_API_BASE_URL =
  process.env.ZERNIO_API_BASE_URL ?? "https://zernio.com/api/v1";
const ZERNIO_API_KEY = process.env.ZERNIO_API;
const ZERNIO_INSTAGRAM_ACCOUNT_ID = process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID;

function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

type PostType = "feed" | "story" | "reel";
type PostStatus = "scheduled" | "published" | "failed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return jsonError("Unauthorized", 401);
  }

  const userId = session.user.id;

  const [stats] = await db
    .select({
      totalPosts: sql<number>`count(*)`,
      scheduledPosts: sql<number>`sum(case when ${post.status} = 'scheduled' then 1 else 0 end)`,
      publishedPosts: sql<number>`sum(case when ${post.status} = 'published' then 1 else 0 end)`,
      failedPosts: sql<number>`sum(case when ${post.status} = 'failed' then 1 else 0 end)`,
    })
    .from(post)
    .where(eq(post.userId, userId));

  const recentPosts = await db
    .select({
      id: post.id,
      platform: post.platform,
      postType: post.postType,
      content: post.content,
      mediaUrl: post.mediaUrl,
      publishNow: post.publishNow,
      scheduledFor: post.scheduledFor,
      status: post.status,
      errorMessage: post.errorMessage,
      zernioPostId: post.zernioPostId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })
    .from(post)
    .where(eq(post.userId, userId))
    .orderBy(desc(post.createdAt))
    .limit(10);

  return Response.json({
    ok: true,
    stats: {
      totalPosts: Number(stats?.totalPosts ?? 0),
      scheduledPosts: Number(stats?.scheduledPosts ?? 0),
      publishedPosts: Number(stats?.publishedPosts ?? 0),
      failedPosts: Number(stats?.failedPosts ?? 0),
    },
    posts: recentPosts,
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return jsonError("Unauthorized", 401);
  }

  if (!ZERNIO_API_KEY) {
    return jsonError("Missing ZERNIO_API in .env", 500);
  }

  if (!ZERNIO_INSTAGRAM_ACCOUNT_ID) {
    return jsonError("Missing ZERNIO_INSTAGRAM_ACCOUNT_ID in .env", 500);
  }

  let body: {
    content?: string;
    mediaUrl?: string;
    postType?: PostType;
    publishNow?: boolean;
    scheduledFor?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.");
  }

  const postType = body.postType ?? "feed";
  const publishNow = body.publishNow ?? true;
  const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null;
  const content = body.content ?? "";
  const mediaUrl = body.mediaUrl ?? "";

  if (!content.trim()) {
    return jsonError("Caption is required.");
  }

  if (!publishNow) {
    if (!scheduledFor || Number.isNaN(scheduledFor.getTime())) {
      return jsonError("Please provide a valid schedule date.");
    }

    const [scheduledPost] = await db
      .insert(post)
      .values({
        userId: session.user.id,
        platform: "instagram",
        postType,
        content,
        mediaUrl: mediaUrl || null,
        publishNow: false,
        scheduledFor,
        status: "scheduled",
      })
      .returning();

    return Response.json({
      ok: true,
      message: "Post scheduled successfully.",
      post: scheduledPost,
    });
  }

  const payload = {
    content,
    mediaItems: mediaUrl
      ? [
          {
            type: inferMediaType(mediaUrl, postType),
            url: mediaUrl,
          },
        ]
      : [],
    platforms: [
      {
        platform: "instagram",
        accountId: ZERNIO_INSTAGRAM_ACCOUNT_ID,
        ...(postType === "story"
          ? { platformSpecificData: { contentType: "story" } }
          : postType === "reel"
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

  const upstreamResponse = await fetch(`${ZERNIO_API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ZERNIO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawResponse = await upstreamResponse.text();

  try {
    const parsed = JSON.parse(rawResponse);
    const success = upstreamResponse.ok;

    const [savedPost] = await db
      .insert(post)
      .values({
        userId: session.user.id,
        platform: "instagram",
        postType,
        content,
        mediaUrl: mediaUrl || null,
        publishNow: true,
        scheduledFor: null,
        status: success ? "published" : "failed",
        zernioPostId: parsed?.id ? String(parsed.id) : null,
        errorMessage: success ? null : parsed?.error ?? null,
      })
      .returning();

    return Response.json(
      {
        ok: success,
        post: savedPost,
        upstream: parsed,
      },
      { status: upstreamResponse.status },
    );
  } catch {
    const [savedPost] = await db
      .insert(post)
      .values({
        userId: session.user.id,
        platform: "instagram",
        postType,
        content,
        mediaUrl: mediaUrl || null,
        publishNow: true,
        scheduledFor: null,
        status: upstreamResponse.ok ? "published" : "failed",
        errorMessage: upstreamResponse.ok ? null : rawResponse,
      })
      .returning();

    return new Response(rawResponse, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type":
          upstreamResponse.headers.get("content-type") ??
          "text/plain; charset=utf-8",
        "X-Post-Id": String(savedPost.id),
      },
    });
  }
}

function inferMediaType(url: string, postType: PostType) {
  if (postType === "reel" || /\.(mp4|mov|webm)(\?|#|$)/i.test(url)) {
    return "video";
  }

  return "image";
}
