"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Search, ShieldCheck, Users } from "lucide-react";

const initialUsers = [
    { id: 1, name: "Ali Hassan", email: "ali@example.com", joinedAt: "2026-05-28", status: "pending", role: "user", avatar: "" },
    { id: 2, name: "Sara Khan", email: "sara@example.com", joinedAt: "2026-05-29", status: "approved", role: "member", avatar: "" },
    { id: 3, name: "John Smith", email: "john@example.com", joinedAt: "2026-05-30", status: "pending", role: "user", avatar: "" },
    { id: 4, name: "Fatima Malik", email: "fatima@example.com", joinedAt: "2026-05-31", status: "approved", role: "admin", avatar: "" },
    { id: 5, name: "Carlos Rivera", email: "carlos@example.com", joinedAt: "2026-06-01", status: "pending", role: "user", avatar: "" },
    { id: 6, name: "Aisha Noor", email: "aisha@example.com", joinedAt: "2026-06-01", status: "rejected", role: "user", avatar: "" },
];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    approved: "default",
    pending: "secondary",
    rejected: "destructive",
};

const roleColors: Record<string, string> = {
    admin: "text-violet-600 bg-violet-50 border-violet-200",
    member: "text-blue-600 bg-blue-50 border-blue-200",
    user: "text-zinc-600 bg-zinc-50 border-zinc-200",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState("");

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    const updateUser = (id: number, field: "role" | "status", value: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
        );
    };

    const totalPending = users.filter((u) => u.status === "pending").length;
    const totalApproved = users.filter((u) => u.status === "approved").length;

    return (
        <div className="min-h-screen bg-background ">
            <div className="mx-auto space-y-6">

                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                        <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">User Management</h1>
                        <p className="text-sm text-muted-foreground">Review and manage user access to the dashboard</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "Total Users", value: users.length, icon: Users },
                        { label: "Pending", value: totalPending, icon: null },
                        { label: "Approved", value: totalApproved, icon: null },
                        { label: "Rejected", value: users.filter((u) => u.status === "rejected").length, icon: null },
                    ].map((stat) => (
                        <Card key={stat.label} className="border shadow-none">
                            <CardContent className="pt-4 pb-4">
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="shadow-none">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base">All Users</CardTitle>
                                <CardDescription>Approve, reject, or change user roles below</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">User</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-6">Approval</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="text-xs font-medium">
                                                            {user.name.split(" ").map((n) => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(user.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                            </TableCell>

                                            <TableCell>
                                                <Select value={user.role} onValueChange={(val) => updateUser(user.id, "role", val)}>
                                                    <SelectTrigger className={`h-8 w-32 text-xs border font-medium ${roleColors[user.role]}`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="user">User</SelectItem>
                                                        <SelectItem value="member">Member</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant={statusVariant[user.status]} className="capitalize text-xs">
                                                    {user.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="pr-6">
                                                <Select value={user.status} onValueChange={(val) => updateUser(user.id, "status", val)}>
                                                    <SelectTrigger className="h-8 w-32 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="approved">Approved</SelectItem>
                                                        <SelectItem value="rejected">Rejected</SelectItem>
                                                    </SelectContent>
                                                </Select>
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