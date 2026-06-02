"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { createAuthClient } from "better-auth/react";
import { Zap } from "lucide-react";
import { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export default function AuthPage() {

    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingGithub, setLoadingGithub] = useState(false);

    const authClient = createAuthClient();

    const signIn = async () => {
        setLoadingGoogle(true);
        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard"
        });

        if (error) {
            toast.error(error.message || "Google sign-in failed");
            setLoadingGoogle(false);
        }
    };

    const signInWithGithub = async () => {
        setLoadingGithub(true);
        const { error } = await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard"
        })

        if (error) {
            toast.error(error.message || "Google sign-in failed");
            setLoadingGoogle(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-6">

                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary mb-1">
                        <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Get started</h1>
                    <p className="text-sm text-muted-foreground">Sign in or create an account to continue</p>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Continue with</CardTitle>
                        <CardDescription>Choose your preferred authentication method</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button disabled={loadingGoogle} onClick={signIn} variant="outline" className="w-full h-11" size="lg">
                            {
                                !loadingGoogle ? <div className="flex items-center gap-2">
                                    <FaGoogle />
                                    Continue with Google
                                </div> : <Spinner />
                            }
                        </Button>

                        <div className="flex items-center gap-3">
                            <Separator className="flex-1" />
                            <span className="text-xs text-muted-foreground">or</span>
                            <Separator className="flex-1" />
                        </div>

                        <Button disabled={loadingGithub} onClick={signInWithGithub} variant="outline" className="w-full h-11" size="lg">
                            {
                                !loadingGithub ? <div className="flex items-center gap-2">
                                    <FaGithub />
                                    Continue with GitHub
                                </div> : <Spinner />
                            }
                        </Button>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <span className="underline underline-offset-4 cursor-pointer hover:text-foreground transition-colors">Terms</span>{" "}
                    and{" "}
                    <span className="underline underline-offset-4 cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>.
                </p>

            </div>
        </div >
    );
}