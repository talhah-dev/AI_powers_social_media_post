"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, ShieldCheck, Mail } from "lucide-react";

export default function PendingApprovalPage() {
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