"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, ExternalLink, LogOut } from "lucide-react";
import { User } from "@/lib/types";

export type AdminTab = "overview" | "moderation" | "users" | "leads" | "settings";

interface AdminHeaderProps {
  user: User | null;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingPropertiesCount: number;
  pendingInquiriesCount: number;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  user,
  activeTab,
  setActiveTab,
  pendingPropertiesCount,
  pendingInquiriesCount,
  onOpenProfile,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900 text-sm">
          <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Building2 className="h-4 w-4" />
          </div>
          <span>LandParcel Admin</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("moderation")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "moderation"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Listings</span>
            {pendingPropertiesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded font-bold">
                {pendingPropertiesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "users"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Users & Agents
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "leads"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Inquiries</span>
            {pendingInquiriesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded font-bold">
                {pendingInquiriesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Settings & Logs
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </Link>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 pl-2 pr-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden relative">
            <Image
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
              }
              alt="Admin"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xs font-medium text-slate-700">{user?.name || "Admin"}</span>
        </button>

        <button
          onClick={onLogout}
          className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
