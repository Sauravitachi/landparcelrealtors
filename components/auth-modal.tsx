"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Briefcase,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register" | "forgot";
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const { login, register, loginAs, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">(initialTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>("BUYER");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);

    const res = login(email, password);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || "Signed in successfully.");
      setTimeout(() => {
        onClose();
        resetState();
      }, 500);
    } else {
      setErrorMsg(res.error || "Invalid credentials.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const res = register({
      name,
      email,
      phone,
      password,
      role: selectedRole,
      companyName: selectedRole === "AGENT" ? companyName : undefined,
      licenseNumber: selectedRole === "AGENT" ? licenseNumber : undefined,
    });
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg("Account created successfully.");
      setTimeout(() => {
        onClose();
        resetState();
      }, 600);
    } else {
      setErrorMsg(res.error || "Registration failed.");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);

    const res = resetPassword(email, "Password123!");
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || "Password reset instructions sent.");
    } else {
      setErrorMsg(res.error || "Failed to reset password.");
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    loginAs(role);
    setSuccessMsg(`Switched to active ${role} profile.`);
    setTimeout(() => {
      onClose();
      resetState();
      window.location.reload();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl text-slate-900">
        {/* Close Button */}
        <button
          onClick={() => {
            resetState();
            onClose();
          }}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            {activeTab === "login"
              ? "Sign In to LandParcel"
              : activeTab === "register"
              ? "Create an Account"
              : "Reset Password"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === "login"
              ? "Access saved properties, tours, and dashboard."
              : activeTab === "register"
              ? "Register as a buyer or certified agent/builder."
              : "Enter your registered email address to reset access."}
          </p>
        </div>

        {/* Demo Fast Logins */}
        <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 block mb-2">
            Demo Accounts (1-Click Switch)
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo("BUYER")}
              className="py-1.5 px-2 bg-white border border-slate-200 hover:border-slate-400 rounded-md font-medium text-slate-800 text-center transition-colors cursor-pointer"
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("AGENT")}
              className="py-1.5 px-2 bg-white border border-slate-200 hover:border-slate-400 rounded-md font-medium text-slate-800 text-center transition-colors cursor-pointer"
            >
              Agent
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("ADMIN")}
              className="py-1.5 px-2 bg-white border border-slate-200 hover:border-slate-400 rounded-md font-medium text-slate-800 text-center transition-colors cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              resetState();
              setActiveTab("login");
            }}
            className={`pb-2 mr-4 transition-colors cursor-pointer ${
              activeTab === "login"
                ? "border-b-2 border-slate-900 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              resetState();
              setActiveTab("register");
            }}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === "register"
                ? "border-b-2 border-slate-900 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@landparcel.com"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    resetState();
                    setActiveTab("forgot");
                  }}
                  className="text-slate-500 hover:text-slate-900 text-[11px]"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 pl-3 pr-8 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole("BUYER")}
                  className={`h-8 border rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedRole === "BUYER"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Buyer / Investor
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("AGENT")}
                  className={`h-8 border rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedRole === "AGENT"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Agent / Builder
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            {selectedRole === "AGENT" && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Agency Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Singhania Luxury Estates"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">RERA Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="RERA-MH-2024-00123"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded bg-white text-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {activeTab === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@landparcel.com"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Reset Password"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  resetState();
                  setActiveTab("login");
                }}
                className="text-slate-500 hover:text-slate-900 text-xs"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
