"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Property, AuditLog } from "@/lib/types";

interface AdminOverviewTabProps {
  stats: {
    totalProperties: number;
    approvedProperties: number;
    pendingProperties: number;
    rejectedProperties: number;
    totalUsers: number;
    verifiedUsers: number;
    totalAgents: number;
    totalInquiries: number;
    pendingInquiries: number;
    confirmedInquiries: number;
    totalPortfolioValue: number;
    cityCounts: Record<string, number>;
    typeCounts: Record<string, number>;
  };
  properties: Property[];
  auditLogs: AuditLog[];
  onNewListing: () => void;
  onViewAllLogs: () => void;
}

export function AdminOverviewTab({
  stats,
  properties,
  auditLogs,
  onNewListing,
  onViewAllLogs,
}: AdminOverviewTabProps) {
  const gmvInCrores = (stats.totalPortfolioValue / 10000000).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Platform portfolio, verification status, and recent activity.
          </p>
        </div>

        <button
          onClick={onNewListing}
          className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Listing</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Portfolio GMV</span>
          <div className="text-xl font-bold text-slate-900">₹{gmvInCrores} Cr</div>
          <span className="text-[10px] text-slate-400">Total Asset Value</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Active Listings</span>
          <div className="text-xl font-bold text-slate-900">{stats.approvedProperties}</div>
          <span className="text-[10px] text-slate-400">Published live</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Pending Review</span>
          <div className="text-xl font-bold text-amber-600">{stats.pendingProperties}</div>
          <span className="text-[10px] text-slate-400">Awaiting moderation</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Total Inquiries</span>
          <div className="text-xl font-bold text-slate-900">{stats.totalInquiries}</div>
          <span className="text-[10px] text-slate-400">{stats.pendingInquiries} pending follow-up</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Agents</span>
          <div className="text-xl font-bold text-slate-900">{stats.totalAgents}</div>
          <span className="text-[10px] text-slate-400">Registered Brokers</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-1">
          <span className="text-[11px] font-medium text-slate-500">Total Users</span>
          <div className="text-xl font-bold text-slate-900">{stats.totalUsers}</div>
          <span className="text-[10px] text-emerald-600 font-medium">
            {stats.verifiedUsers} Verified
          </span>
        </div>
      </div>

      {/* Inventory Distribution and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Breakdown */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Listings by City</h2>
          <div className="space-y-2.5">
            {Object.entries(stats.cityCounts).map(([city, count]) => {
              const pct = Math.round((count / Math.max(1, properties.length)) * 100);
              return (
                <div key={city} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{city}</span>
                    <span className="text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Stream */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Audit Logs</h2>
            <button
              onClick={onViewAllLogs}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-800">{log.details}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">By {log.adminName}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
