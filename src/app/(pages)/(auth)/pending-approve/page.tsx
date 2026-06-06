"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, ShieldCheck, Mail, XCircle, CheckCircle2, ArrowLeft, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type User = {
    id: number;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
    role: string;
    approval: string;
};

function RejectedState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-1">
                        <XCircle className="w-7 h-7 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-red-600">Access Denied</h1>
                    <p className="text-sm text-muted-foreground">Your account request has been rejected</p>
                </div>

                <Card className="border-red-200 bg-red-50/40">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Account Status</CardTitle>
                            <Badge variant="secondary" className="text-red-600 bg-red-100 border border-red-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Rejected
                            </Badge>
                        </div>
                        <CardDescription>
                            Unfortunately, an admin has reviewed your account and denied access. If you believe this is a mistake, please contact support.
                        </CardDescription>
                    </CardHeader>

                    <Separator className="bg-red-200" />

                    <CardContent className="pt-5 space-y-4">
                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 shrink-0">
                                <Mail className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Need help?</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Reach out to your administrator to appeal this decision or get more information about why your request was denied.</p>
                            </div>
                        </div>

                        <Link href="/auth">
                            <Button variant="outline" className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function PendingState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-1">
                        <ShieldCheck className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">You're in the queue</h1>
                    <p className="text-sm text-muted-foreground">Your account is pending admin approval</p>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Account Status</CardTitle>
                            <Badge variant="secondary" className="text-yellow-600 bg-yellow-50 border border-yellow-200">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending Review
                            </Badge>
                        </div>
                        <CardDescription>
                            You have successfully signed in. An admin will review your account and grant access to the dashboard.
                        </CardDescription>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-5 space-y-4">
                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0">
                                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Admin Verification</p>
                                <p className="text-xs text-muted-foreground mt-0.5">An admin will manually review your request and decide whether to grant you access to the social media dashboard.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">You'll be notified</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Once a decision is made, you'll receive a notification. If approved, you'll have full access to manage all your social media posts.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Typical wait time</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Most accounts are reviewed within 24–48 hours. Thank you for your patience.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ApprovedState({ name }: { name: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 mb-1">
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">You're all set!</h1>
                    <p className="text-sm text-muted-foreground">Your account has been approved</p>
                </div>

                <Card className="border-green-200 bg-green-50/40">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Account Status</CardTitle>
                            <Badge variant="secondary" className="text-green-700 bg-green-100 border border-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approved
                            </Badge>
                        </div>
                        <CardDescription>
                            Welcome aboard, <span className="font-medium text-foreground">{name}</span>! Your account has been verified and you now have full access.
                        </CardDescription>
                    </CardHeader>

                    <Separator className="bg-green-200" />

                    <CardContent className="pt-5 space-y-4">
                        <div className="flex gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 shrink-0">
                                <LayoutDashboard className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Dashboard Access</p>
                                <p className="text-xs text-muted-foreground mt-0.5">You can now manage all your social media posts and content from the dashboard.</p>
                            </div>
                        </div>

                        <Link href="/dashboard">
                            <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Go to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PendingApprovalPage() {

    const [user, setUser] = useState<User | null>();
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/auth");
        }
    }, [session, isPending, router]);


    useEffect(() => {

        if (!session) {
            return
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/users/user");
                if (!res.data) {
                    toast.error("You are not logged in");
                    router.replace("/auth");
                    return;
                }
                if (res.data.approval === "approved") {
                    router.replace("/dashboard");
                    return
                }
                setUser(res.data);
            } catch (err) {
                toast.error("Failed to fetch user");
            }
        };

        fetchUser();
    }, [router]);

    if (!user) {
        return (
            <div className="w-full h-screen items-center justify-center flex">
                <Spinner />
            </div>
        );
    }

    if (user.approval === "rejected") {
        return <RejectedState />;
    }

    if (user.approval === "approved") {
        return <ApprovedState name={user.name} />;
    }

    return <PendingState />;
}
