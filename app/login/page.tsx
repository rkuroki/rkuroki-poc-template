"use client";

import { useTransition } from "react";
import { loginOrRegister } from "@/lib/auth";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginOrRegister(formData);
      if (res?.error) {
        alert(res.error);
      } else {
        window.location.href = "/dashboard";
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm shrink-0 rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 text-center">Sign In / Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1234567890"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Please wait..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
