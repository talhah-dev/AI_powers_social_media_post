"use client";

import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type PostType = "feed" | "carousel" | "story" | "reel";

function inferMediaType(url: string, postType: PostType) {
  if (postType === "reel" || /\.(mp4|mov|webm)(\?|#|$)/i.test(url)) {
    return "video";
  }

  return "image";
}

export default function Home() {
  const [postType, setPostType] = useState<PostType>("feed");
  const [caption, setCaption] = useState("");
  const [mediaUrls, setMediaUrls] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const urls = mediaUrls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      if (urls.length === 0) {
        throw new Error("Add at least one media URL.");
      }

      const payload = {
        content: caption,
        postType,
        mediaItems: urls.map((url) => ({
          type: inferMediaType(url, postType),
          url,
        })),
        publishNow: true,
      };

      const response = await fetch("/api/zernio/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Zernio rejected the request.");
      }

      setMessage(
        `Post sent successfully${data?.post?._id ? `, id: ${data.post._id}` : "."}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge className="mb-3 bg-pink-100 text-pink-700 hover:bg-pink-100">
              Zernio
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Simple Instagram publisher
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              This page sends your post data to a small Next.js API route, which
              then forwards it to Zernio using the API key from `.env`.
            </p>
          </div>
        </div>

        <Card className="border-0 bg-white/80 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Create post</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="postType">Post type</Label>
                <Select value={postType} onValueChange={(value) => setPostType(value as PostType)}>
                  <SelectTrigger id="postType">
                    <SelectValue placeholder="Select a post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feed">Feed</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Write your caption here"
                  className="min-h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaUrls">
                  Media URL{postType === "carousel" ? "s" : ""}
                </Label>
                <Textarea
                  id="mediaUrls"
                  value={mediaUrls}
                  onChange={(event) => setMediaUrls(event.target.value)}
                  placeholder={
                    postType === "carousel"
                      ? "One direct media URL per line"
                      : "Paste one direct image or video URL"
                  }
                  className="min-h-32 resize-none"
                />
                <p className="text-xs text-gray-500">
                  Use direct media links, not Google Drive, Dropbox, or other
                  HTML preview pages.
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-pink-200 bg-pink-50/50 p-4 text-sm text-gray-600">
                {postType === "story"
                  ? "Story mode adds the Zernio story flag."
                  : postType === "reel"
                    ? "Reel mode adds the Zernio reels flag and shares it to feed."
                    : "Feed and carousel use the default Zernio post type."}
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {message}
                </div>
              ) : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to Zernio
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
