"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ImagePlus,
    Clock,
    CheckCircle2,
    FileX2,
    TrendingUp,
    Activity,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { toast } from "sonner";

type DashboardSummary = {
    stats: {
        totalPosts: number;
        publishedPosts: number;
        scheduledPosts: number;
        failedPosts: number;
    };
    publishRate: {
        published: number;
        scheduled: number;
        failed: number;
    };
    recentActivity: Array<{
        id: number;
        title: string;
        platform: string;
        type: string;
        status: string;
        date: string;
    }>;
    weekCounts: Array<{
        day: string;
        count: number;
    }>;
};

const fallbackSummary: DashboardSummary = {
    stats: {
        totalPosts: 0,
        publishedPosts: 0,
        scheduledPosts: 0,
        failedPosts: 0,
    },
    publishRate: {
        published: 0,
        scheduled: 0,
        failed: 0,
    },
    recentActivity: [],
    weekCounts: [
        { day: "M", count: 0 },
        { day: "T", count: 0 },
        { day: "W", count: 0 },
        { day: "T", count: 0 },
        { day: "F", count: 0 },
        { day: "S", count: 0 },
        { day: "S", count: 0 },
    ],
};

const statusStyles: Record<string, string> = {
    published: "text-green-700 bg-green-50 border-green-200",
    scheduled: "text-yellow-700 bg-yellow-50 border-yellow-200",
    draft: "text-zinc-600 bg-zinc-50 border-zinc-200",
    failed: "text-red-600 bg-red-50 border-red-200",
};

export default function DashboardPage() {
    const [summary, setSummary] = useState<DashboardSummary>(fallbackSummary);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const res = await axios.get("/api/dashboard");
                setSummary({
                    ...fallbackSummary,
                    ...res.data,
                });
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        loadSummary();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Posts", value: summary.stats.totalPosts, icon: ImagePlus, description: "All time uploads" },
                        { label: "Published", value: summary.stats.publishedPosts, icon: CheckCircle2, description: "Successfully live" },
                        { label: "Scheduled", value: summary.stats.scheduledPosts, icon: Clock, description: "Queued to publish" },
                        { label: "Failed / Draft", value: summary.stats.failedPosts, icon: FileX2, description: "Needs attention" },
                    ].map((stat) => (
                        <Card key={stat.label} className="shadow-none">
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold tracking-tight">{loading ? "..." : stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <Card className="shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Publish Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Published</span>
                                    <span>{summary.publishRate.published}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${summary.publishRate.published}%` }} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Scheduled</span>
                                    <span>{summary.publishRate.scheduled}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${summary.publishRate.scheduled}%` }} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Failed / Draft</span>
                                    <span>{summary.publishRate.failed}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${summary.publishRate.failed}%` }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none md:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Posts This Week
                            </CardTitle>
                            <CardDescription className="text-xs">Daily upload activity — Mon to Sun</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 h-20">
                                {summary.weekCounts.map((item, index) => {
                                    const height = Math.max(8, item.count * 14);
                                    return (
                                        <div key={`${item.day}-${index}`} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className="w-full rounded-sm bg-primary/80"
                                                style={{ height }}
                                            />
                                            <span className="text-[10px] text-muted-foreground">
                                                {item.day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Recent Activity</CardTitle>
                                <CardDescription className="text-xs mt-0.5">Your latest posts and their current status</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">Post</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="pr-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.recentActivity.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                            No posts found yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    summary.recentActivity.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="pl-6 font-medium text-sm">{item.title}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{item.type}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <FaInstagram className="w-3.5 h-3.5" />
                                                    {item.platform}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(item.date).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="pr-6">
                                                <Badge variant="outline" className={`capitalize text-xs ${statusStyles[item.status] ?? statusStyles.draft}`}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
