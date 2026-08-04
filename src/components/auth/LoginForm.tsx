"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Shield, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsSubmitting(true);
        console.log("Login Form Data:", data);
        // Submit handling / API integration will go here
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);
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
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                            />
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
                        {isSubmitting ? "Signing In..." : "Sign In"}
                        <ArrowRight className="h-4 w-4" />
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
