"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AdminGatekeeperProps {
  onSuccess?: () => void;
}

export function AdminGatekeeper({ onSuccess }: AdminGatekeeperProps) {
  const { login, loginAs } = useAuth();
  const [gateEmail, setGateEmail] = useState("admin@landparcel.com");
  const [gatePassword, setGatePassword] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);

  const handleGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError(null);

    if (gatePassword === "Password123!" || gatePassword === "admin") {
      loginAs("ADMIN");
      onSuccess?.();
      return;
    }

    const res = login(gateEmail, gatePassword);
    if (!res.success) {
      setGateError(res.error || "Invalid administrator credentials.");
    } else {
      onSuccess?.();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
            <Shield className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Admin Authentication</h1>
          <p className="text-xs text-slate-500">
            Sign in to manage listings, moderate submissions, and view platform metrics.
          </p>
        </div>

        {gateError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{gateError}</span>
          </div>
        )}

        <form onSubmit={handleGateLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={gateEmail}
              onChange={(e) => setGateEmail(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={gatePassword}
              onChange={(e) => setGatePassword(e.target.value)}
              placeholder="Password123!"
              className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Sign In to Admin Panel
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              loginAs("ADMIN");
              onSuccess?.();
            }}
            className="w-full h-9 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Quick Access as SuperAdmin (Demo)</span>
          </button>

          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-900 text-center transition-colors"
          >
            ← Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}
