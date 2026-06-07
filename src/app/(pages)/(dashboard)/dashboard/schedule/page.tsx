"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarCheck, Clock, Send, Sparkles, FileClock } from "lucide-react";
import { toast } from "sonner";

type PostStatus = "scheduled" | "published" | "failed";

type DashboardPost = {
  id: number;
  platform: string;
  postType: string;
  content: string;
  mediaUrl: string | null;
  publishNow: boolean;
  scheduledFor: string | null;
  status: PostStatus;
  errorMessage: string | null;
  zernioPostId: string | null;
  createdAt: string;
  updatedAt: string;
};

type PostStats = {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  failedPosts: number;
};

const initialStats: PostStats = {
  totalPosts: 0,
  scheduledPosts: 0,
  publishedPosts: 0,
  failedPosts: 0,
};

export default function SchedulerPage() {
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [postType, setPostType] = useState<"feed" | "story" | "reel">("feed");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");
  const [stats, setStats] = useState<PostStats>(initialStats);
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/zernio/posts");
      setStats(res.data.stats ?? initialStats);
      setPosts(res.data.posts ?? []);
    } catch (error) {
      toast.error("Failed to load scheduled posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast.error("Caption is required");
      return;
    }

    if (!mediaUrl.trim()) {
      toast.error("Media URL is required");
      return;
    }

    if (scheduleEnabled && !scheduledFor) {
      toast.error("Please choose a schedule time");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post("/api/zernio/posts", {
        content: caption,
        mediaUrl,
        postType,
        publishNow: !scheduleEnabled,
        scheduledFor: scheduleEnabled ? scheduledFor : null,
      });

      toast.success(res.data?.message ?? (scheduleEnabled ? "Post scheduled" : "Post published"));
      setCaption("");
      setMediaUrl("");
      setPostType("feed");
      setScheduleEnabled(false);
      setScheduledFor("");
      await loadPosts();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        error?.message ??
        "Failed to save post";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <CalendarCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Post Scheduler</h1>
            <p className="text-sm text-muted-foreground">
              Publish now or schedule a post for later
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="shadow-none">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold mt-0.5">{stats.totalPosts}</p>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold mt-0.5">{stats.scheduledPosts}</p>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">Published</p>
              <p className="text-2xl font-bold mt-0.5">{stats.publishedPosts}</p>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold mt-0.5">{stats.failedPosts}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Create Post
            </CardTitle>
            <CardDescription className="text-xs">
              Use a media URL, add a caption, then publish immediately or schedule it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Post Type</Label>
                <Select value={postType} onValueChange={(value) => setPostType(value as typeof postType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feed">Feed</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Media URL</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Caption</Label>
              <Textarea
                placeholder="Write your caption here..."
                className="min-h-[120px] resize-none"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">Schedule Post</p>
                <p className="text-xs text-muted-foreground">
                  Turn this on to save the post for later instead of publishing now
                </p>
              </div>
              <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
            </div>

            {scheduleEnabled && (
              <div className="space-y-1.5">
                <Label>Scheduled Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleSubmit} disabled={saving} className="w-full md:w-auto">
              {saving ? (
                "Saving..."
              ) : scheduleEnabled ? (
                <>
                  <FileClock className="w-4 h-4 mr-2" />
                  Schedule Post
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Publish Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Posts
            </CardTitle>
            <CardDescription className="text-xs">
              Latest scheduled and published posts from your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts found yet.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-4 rounded-xl border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {post.status}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {post.postType}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{post.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.mediaUrl ? post.mediaUrl : "No media URL"}{" "}
                      {post.scheduledFor ? `· Scheduled for ${new Date(post.scheduledFor).toLocaleString()}` : ""}
                    </p>
                    {post.errorMessage ? (
                      <p className="text-xs text-red-600">{post.errorMessage}</p>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
