"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Shield, ArrowRight, Eye, EyeOff, Sparkles, User, Store, Loader2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/actions/userAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isColdStart, setIsColdStart] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Warm up backend when login form renders
    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API || "https://gearup-backend-4eca.onrender.com/api";
        // Ping backend health and root to wake up Render instance immediately
        fetch(`${baseUrl.replace(/\/api\/?$/, "")}/health`, { mode: "no-cors" }).catch(() => {});
        fetch(baseUrl, { mode: "no-cors" }).catch(() => {});
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const executeLogin = async (data: LoginFormValues) => {
        setIsSubmitting(true);
        setIsColdStart(false);

        // Timer to warn user if Render cold start is occurring
        const coldStartTimer = setTimeout(() => {
            setIsColdStart(true);
        }, 2500);

        try {
            const res = await loginUser(data);
            if (res?.success) {
                toast.success(res?.message || "Logged in successfully!");
                router.push(redirectPath || "/");
                router.refresh();
            } else {
                toast.error(res?.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("An unexpected error occurred during login.");
        } finally {
            clearTimeout(coldStartTimer);
            setIsSubmitting(false);
            setIsColdStart(false);
        }
    };

    const onSubmit = (data: LoginFormValues) => {
        executeLogin(data);
    };

    // 1-Click Instant Demo Login
    const handleDemoLogin = (email: string, pass: string) => {
        setValue("email", email, { shouldValidate: true });
        setValue("password", pass, { shouldValidate: true });
        toast.info(`Logging in with demo account (${email})...`);
        executeLogin({ email, password: pass });
    };

    return (
        <Card className="w-full max-w-md bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-md">
            <CardHeader className="space-y-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                    <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-slate-400">
                    Sign in to access your GearUp account & rentals
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Demo Login Shortcuts */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-teal-400">
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" />
                                1-Click Demo Login:
                            </span>
                            <span className="text-[10px] text-slate-500 font-normal">Click to login</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleDemoLogin("arif.customer@gearup.com", "Pass@1234")}
                                className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-[11px] font-medium text-slate-300 hover:border-teal-500/50 hover:bg-slate-800 hover:text-teal-300 transition-all active:scale-[0.97] disabled:opacity-50"
                            >
                                <User className="h-3.5 w-3.5 text-teal-400 mb-1" />
                                <span>Customer</span>
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleDemoLogin("summit.provider@gearup.com", "Pass@1234")}
                                className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-[11px] font-medium text-slate-300 hover:border-emerald-500/50 hover:bg-slate-800 hover:text-emerald-300 transition-all active:scale-[0.97] disabled:opacity-50"
                            >
                                <Store className="h-3.5 w-3.5 text-emerald-400 mb-1" />
                                <span>Provider</span>
                            </button>

                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => handleDemoLogin("admin@gearup.com", "Pass@1234")}
                                className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-[11px] font-medium text-slate-300 hover:border-purple-500/50 hover:bg-slate-800 hover:text-purple-300 transition-all active:scale-[0.97] disabled:opacity-50"
                            >
                                <Shield className="h-3.5 w-3.5 text-purple-400 mb-1" />
                                <span>Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Cold Start Indicator Notice */}
                    {isColdStart && (
                        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin shrink-0 text-amber-400" />
                            <span>Waking up cloud backend (Render cold start ~20s)... Please wait!</span>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="john@example.com"
                                className="pl-10"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-rose-400">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-300">Password</label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-rose-400">{errors.password.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="default"
                        size="lg"
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {isColdStart ? "Waking Server..." : "Logging In..."}
                            </span>
                        ) : (
                            <>
                                Login
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <p className="text-center text-xs text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-teal-400 hover:underline"
                        >
                            Register Now
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
