import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { post } from "@/models/post";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DashboardPost = {
  id: number;
  platform: string;
  postType: string;
  content: string;
  status: string;
  createdAt: Date;
  scheduledFor: Date | null;
};

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const posts = (await db
    .select({
      id: post.id,
      platform: post.platform,
      postType: post.postType,
      content: post.content,
      status: post.status,
      createdAt: post.createdAt,
      scheduledFor: post.scheduledFor,
    })
    .from(post)
    .where(eq(post.userId, userId))
    .orderBy(desc(post.createdAt))) as DashboardPost[];

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((item) => item.status === "published").length;
  const scheduledPosts = posts.filter((item) => item.status === "scheduled").length;
  const failedPosts = posts.filter((item) => item.status === "failed").length;

  const recentActivity = posts.slice(0, 7).map((item) => ({
    id: item.id,
    title: item.content.slice(0, 42) || "Untitled post",
    platform: capitalize(item.platform),
    type: labelizePostType(item.postType),
    status: item.status,
    date: (item.scheduledFor ?? item.createdAt).toISOString(),
  }));

  const weekCounts = buildWeekCounts(posts);

  return Response.json({
    ok: true,
    stats: {
      totalPosts,
      publishedPosts,
      scheduledPosts,
      failedPosts,
    },
    publishRate: {
      published: totalPosts ? Math.round((publishedPosts / totalPosts) * 100) : 0,
      scheduled: totalPosts ? Math.round((scheduledPosts / totalPosts) * 100) : 0,
      failed: totalPosts ? Math.round((failedPosts / totalPosts) * 100) : 0,
    },
    recentActivity,
    weekCounts,
  });
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function labelizePostType(value: string) {
  if (value === "feed") return "Feed Post";
  if (value === "story") return "Story";
  if (value === "reel") return "Reel";
  return value;
}

function buildWeekCounts(posts: DashboardPost[]) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const counts = new Array(7).fill(0);
  const now = new Date();

  for (const item of posts) {
    const date = item.scheduledFor ?? item.createdAt;
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      const jsDay = date.getDay();
      const idx = jsDay === 0 ? 6 : jsDay - 1;
      counts[idx] += 1;
    }
  }

  return days.map((day, index) => ({
    day,
    count: counts[index],
  }));
}
