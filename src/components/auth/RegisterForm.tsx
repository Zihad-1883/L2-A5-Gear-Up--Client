"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, UserCheck, Store, Shield, ArrowRight, Eye, EyeOff } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/userAuth";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "PROVIDER"], {
        required_error: "Please select a role",
    }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "CUSTOMER",
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (data: RegisterFormValues) => {
        setIsSubmitting(true);
        // console.log("Register Form Data:", data);
        const result = await registerUser(data);
        // console.log(result);
        if (result.success) {
            toast.success(result.message);
            router.push("/");
        } else {
            toast.error(result.message || result.error || "Registration failed");
        }

        setIsSubmitting(false);
    };

    return (
        <Card className="w-full max-w-md bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-md">
            <CardHeader className="space-y-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                    <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                <CardDescription className="text-slate-400">
                    Join GearUp to rent gear or host your equipment
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                            I want to register as
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setValue("role", "CUSTOMER")}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${selectedRole === "CUSTOMER"
                                    ? "border-teal-500 bg-teal-500/10 text-teal-400 font-bold shadow-md shadow-teal-500/10"
                                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                    }`}
                            >
                                <UserCheck className="h-5 w-5" />
                                <span className="text-xs">Customer</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue("role", "PROVIDER")}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${selectedRole === "PROVIDER"
                                    ? "border-teal-500 bg-teal-500/10 text-teal-400 font-bold shadow-md shadow-teal-500/10"
                                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                    }`}
                            >
                                <Store className="h-5 w-5" />
                                <span className="text-xs">Gear Provider</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                {...register("name")}
                                placeholder="John Doe"
                                className="pl-10"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-rose-400">{errors.name.message}</p>
                        )}
                    </div>

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
                        <label className="text-xs font-semibold text-slate-300">Password</label>
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
                        {isSubmitting ? "Creating Account..." : "Register"}
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <p className="text-center text-xs text-slate-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-teal-400 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
