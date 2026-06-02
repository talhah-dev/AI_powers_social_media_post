"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

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

type User = {
    id: number;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
    role: string;
    approval: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [savingId, setSavingId] = useState<number | null>(null);
    const [laoding, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/users");
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to fetch users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (id: number, role: string) => {
        setSavingId(id);
        try {
            await axios.post("/api/auth/verify-user", {
                userId: String(id),
                role,
            });
        } catch (err) {
            toast.error("Failed to update role");
        } finally {
            setSavingId(null);
        }
    };



    const updateApproval = async (id: number, approval: string) => {
        setSavingId(id);
        try {
            await axios.post("/api/auth/verify-user", {
                userId: String(id),
                approval,
            });
        } catch (err) {
            toast.error("Failed to update approval status");
        } finally {
            setSavingId(null);
        }
    };

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
                        { label: "Pending", value: "2", icon: null },
                        { label: "Approved", value: "3", icon: null },
                        { label: "Rejected", value: users.filter((u: User) => u.approval === "rejected").length, icon: null },
                    ].map((stat) => (
                        <Card key={stat.label} className="border shadow-none">
                            <CardContent className="pt-4 pb-4">
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="shadow-none pb-1">
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

                    {
                        !laoding ? (
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
                                        {users.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.map((user: User) => (
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
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Select
                                                            value={user.role}
                                                            onValueChange={(val) => updateRole(user.id, val)}
                                                            disabled={savingId === user.id}
                                                        >
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
                                                        <Badge variant={statusVariant[user.approval]} className="capitalize text-xs">
                                                            {user.approval}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell className="pr-6">
                                                        <Select
                                                            value={user.approval}
                                                            onValueChange={(val) => updateApproval(user.id, val)}
                                                            disabled={savingId === user.id}
                                                        >
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
                        ) : <div className="flex items-center justify-center h-60">
                            <Spinner />
                        </div>
                    }

                </Card>

            </div>
        </div>
    );
}
