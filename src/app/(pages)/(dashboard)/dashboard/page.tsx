"use client";

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
    LayoutDashboard,
    ImagePlus,
    Clock,
    CheckCircle2,
    FileX2,
    TrendingUp,
    Activity,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const stats = [
    { label: "Total Posts", value: 48, icon: ImagePlus, description: "All time uploads" },
    { label: "Published", value: 35, icon: CheckCircle2, description: "Successfully live" },
    { label: "Scheduled", value: 9, icon: Clock, description: "Queued to publish" },
    { label: "Failed / Draft", value: 4, icon: FileX2, description: "Needs attention" },
];

const recentActivity = [
    { id: 1, title: "Summer Sale Promo", platform: "Instagram", type: "Feed Post", status: "published", date: "2026-06-01 09:14" },
    { id: 2, title: "New Product Launch", platform: "Instagram", type: "Reel", status: "scheduled", date: "2026-06-02 12:00" },
    { id: 3, title: "Behind the Scenes", platform: "Instagram", type: "Story", status: "published", date: "2026-05-31 18:30" },
    { id: 4, title: "Customer Testimonial", platform: "Instagram", type: "Carousel", status: "draft", date: "2026-05-31 14:00" },
    { id: 5, title: "Weekly Tip #12", platform: "Instagram", type: "Feed Post", status: "published", date: "2026-05-30 10:00" },
    { id: 6, title: "Flash Sale Tonight", platform: "Instagram", type: "Feed Post", status: "failed", date: "2026-05-29 20:00" },
    { id: 7, title: "Team Spotlight", platform: "Instagram", type: "Reel", status: "scheduled", date: "2026-06-03 09:00" },
];

const statusStyles: Record<string, string> = {
    published: "text-green-700 bg-green-50 border-green-200",
    scheduled: "text-yellow-700 bg-yellow-50 border-yellow-200",
    draft: "text-zinc-600 bg-zinc-50 border-zinc-200",
    failed: "text-red-600 bg-red-50 border-red-200",
};

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto space-y-8">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="shadow-none">
                            <CardContent className=" space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
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
                                    <span>73%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full w-[73%] bg-primary rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Scheduled</span>
                                    <span>19%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full w-[19%] bg-yellow-400 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Failed / Draft</span>
                                    <span>8%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full w-[8%] bg-red-400 rounded-full" />
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
                                {[3, 5, 2, 7, 4, 6, 1].map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full rounded-sm bg-primary/80"
                                            style={{ height: `${(val / 7) * 100}%` }}
                                        />
                                        <span className="text-[10px] text-muted-foreground">
                                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                                        </span>
                                    </div>
                                ))}
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
                                {recentActivity.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-6 font-medium text-sm">{item.title}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{item.type}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <FaInstagram className="w-3.5 h-3.5" />
                                                {item.platform}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                                        <TableCell className="pr-6">
                                            <Badge variant="outline" className={`capitalize text-xs ${statusStyles[item.status]}`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}