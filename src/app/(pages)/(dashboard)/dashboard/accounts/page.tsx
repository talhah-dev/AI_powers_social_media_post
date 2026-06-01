"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link2, Plus, Unlink, CheckCircle2, XCircle } from "lucide-react";
import type { ReactNode } from "react";

type PlatformAccount = {
    id: number;
    name: string;
    handle: string | null;
    connected: boolean;
    connectedAt: string | null;
    icon: ReactNode;
    color: string;
    bg: string;
    border: string;
};

const platforms: PlatformAccount[] = [
    {
        id: 1,
        name: "Instagram",
        handle: "@yourbrand",
        connected: true,
        connectedAt: "2026-05-20",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        color: "text-pink-600",
        bg: "bg-pink-50",
        border: "border-pink-200",
    },
    {
        id: 2,
        name: "LinkedIn",
        handle: "Your Brand Inc.",
        connected: true,
        connectedAt: "2026-05-22",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
    },
    {
        id: 3,
        name: "X (Twitter)",
        handle: "@yourbrand",
        connected: false,
        connectedAt: null,
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        color: "text-zinc-800",
        bg: "bg-zinc-50",
        border: "border-zinc-200",
    },
    {
        id: 4,
        name: "Facebook",
        handle: null,
        connected: false,
        connectedAt: null,
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
    },
    {
        id: 5,
        name: "TikTok",
        handle: null,
        connected: false,
        connectedAt: null,
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
            </svg>
        ),
        color: "text-zinc-900",
        bg: "bg-zinc-50",
        border: "border-zinc-200",
    },
    {
        id: 6,
        name: "YouTube",
        handle: null,
        connected: false,
        connectedAt: null,
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
    },
];

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<PlatformAccount[]>(platforms);

    const connected = accounts.filter((a) => a.connected).length;

    const toggleConnection = (id: number) => {
        setAccounts((prev) =>
            prev.map((a) =>
                a.id === id
                    ? {
                        ...a,
                        connected: !a.connected,
                        connectedAt: !a.connected ? new Date().toISOString().split("T")[0] : null,
                        handle: !a.connected ? "@yourbrand" : null,
                    }
                    : a
            )
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto space-y-6">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                            <Link2 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Connected Accounts</h1>
                            <p className="text-sm text-muted-foreground">Manage your social media connections</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-xs gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        {connected} of {accounts.length} connected
                    </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Card className="shadow-none text-center">
                        <CardContent className="pt-5 pb-5">
                            <p className="text-3xl font-bold">{connected}</p>
                            <p className="text-xs text-muted-foreground mt-1">Connected</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none text-center">
                        <CardContent className="pt-5 pb-5">
                            <p className="text-3xl font-bold">{accounts.length - connected}</p>
                            <p className="text-xs text-muted-foreground mt-1">Not Connected</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none text-center col-span-2 md:col-span-1">
                        <CardContent className="pt-5 pb-5">
                            <p className="text-3xl font-bold">{accounts.length}</p>
                            <p className="text-xs text-muted-foreground mt-1">Total Platforms</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">All Platforms</CardTitle>
                        <CardDescription className="text-xs">Connect or disconnect your social media accounts</CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        {accounts.map((account, index) => (
                            <div key={account.id}>
                                <div className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${account.bg} ${account.border} ${account.color}`}>
                                            {account.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold">{account.name}</p>
                                                {account.connected ? (
                                                    <Badge variant="outline" className="text-[10px] text-green-700 bg-green-50 border-green-200 gap-1 px-1.5 py-0">
                                                        <CheckCircle2 className="w-3 h-3" /> Connected
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] text-zinc-500 bg-zinc-50 border-zinc-200 gap-1 px-1.5 py-0">
                                                        <XCircle className="w-3 h-3" /> Not Connected
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {account.connected
                                                    ? `${account.handle} · Since ${account.connectedAt}`
                                                    : "Not connected yet"}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant={account.connected ? "outline" : "default"}
                                        size="sm"
                                        className="text-xs h-8 gap-1.5"
                                        onClick={() => toggleConnection(account.id)}
                                    >
                                        {account.connected ? (
                                            <>
                                                <Unlink className="w-3.5 h-3.5" /> Disconnect
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-3.5 h-3.5" /> Connect
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {index < accounts.length - 1 && <Separator />}
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
