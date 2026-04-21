"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFields } from "@/features/auth/schemas";
import { useAuthStore } from "@/features/auth/store";
import type { User } from "@/types/user";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPw, setShowPw] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ resolver: zodResolver(loginSchema) });

  const signIn = (user: User, remember: boolean) => {
    login(user, remember);
    router.push("/discovery");
  };

  const onSubmit = (data: LoginFields) => {
    const name = data.email.split("@")[0] ?? "user";
    const user: User = {
      id: crypto.randomUUID(),
      firstName: name.charAt(0).toUpperCase() + name.slice(1),
      lastName: "",
      email: data.email,
    };
    signIn(user, data.rememberMe ?? false);
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100">Welcome back</h1>
        <p className="text-zinc-400 mt-1 text-sm">Sign in to your SpaceBase account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <label className="block text-sm text-zinc-300 mb-1.5">Email</label>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm text-zinc-300">Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
          {forgotSent && <p className="text-emerald-400 text-xs mt-1.5">Password reset email sent.</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register("rememberMe")}
            type="checkbox"
            id="rememberMe"
            className="w-4 h-4 rounded accent-emerald-500 bg-zinc-800 border-zinc-700"
          />
          <label htmlFor="rememberMe" className="text-sm text-zinc-400 cursor-pointer">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-medium rounded-lg px-4 py-3 text-sm transition-colors"
        >
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-zinc-400 mt-6">
        No account?{" "}
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
