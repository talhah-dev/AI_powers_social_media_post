const ZERNIO_API_BASE_URL = process.env.ZERNIO_API_BASE_URL ?? "https://zernio.com/api/v1";
const ZERNIO_API_KEY = process.env.ZERNIO_API;
const ZERNIO_INSTAGRAM_ACCOUNT_ID = process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID;

function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

type PostType = "feed" | "story" | "reel";

export async function POST(request: Request) {
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
  };

  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON.");
  }

  const postType = body.postType ?? "feed";

  const payload = {
    content: body.content ?? "",
    mediaItems: [
      {
        type: inferMediaType(body.mediaUrl ?? "", postType),
        url: body.mediaUrl ?? "",
      },
    ],
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
    publishNow: body.publishNow ?? true,
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
    return Response.json(parsed, { status: upstreamResponse.status });
  } catch {
    return new Response(rawResponse, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type":
          upstreamResponse.headers.get("content-type") ?? "text/plain; charset=utf-8",
      },
  });
}

function inferMediaType(url: string, postType: PostType) {
  if (postType === "reel" || /\.(mp4|mov|webm)(\?|#|$)/i.test(url)) {
    return "video";
  }

  return "image";
}
}
