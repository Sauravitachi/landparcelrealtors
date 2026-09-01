"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { AuditLog, PlatformSettings } from "@/lib/types";

interface AdminSettingsTabProps {
  settings: PlatformSettings;
  auditLogs: AuditLog[];
  onSaveSettings: (settings: PlatformSettings) => void;
}

export function AdminSettingsTab({
  settings,
  auditLogs,
  onSaveSettings,
}: AdminSettingsTabProps) {
  const [form, setForm] = useState<PlatformSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [auditFilter, setAuditFilter] = useState<string>("ALL");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilter !== "ALL" && log.targetType !== auditFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Platform Settings & Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Brokerage parameters, compliance configuration, and historical activity logs.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Platform settings updated and logged.</span>
        </div>
      )}

      {/* Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white border border-slate-200 rounded-lg space-y-4 text-xs"
      >
        <h2 className="text-sm font-bold text-slate-900">Brokerage & Compliance Rules</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Standard Commission Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={form.commissionRate}
              onChange={(e) =>
                setForm({ ...form, commissionRate: parseFloat(e.target.value) || 0 })
              }
              className="w-full h-9 px-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Max Featured Listings
            </label>
            <input
              type="number"
              value={form.maxFeaturedListings}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxFeaturedListings: parseInt(e.target.value, 10) || 12,
                })
              }
              className="w-full h-9 px-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Support Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Hotline Phone</label>
            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-2">
          <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-900 block">Strict RERA Compliance</span>
              <span className="text-[11px] text-slate-500">Require valid registration before publishing listings</span>
            </div>
            <input
              type="checkbox"
              checked={form.strictReraCompliance}
              onChange={(e) =>
                setForm({ ...form, strictReraCompliance: e.target.checked })
              }
              className="rounded border-slate-300 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-900 block">Auto-Approve Verified Brokers</span>
              <span className="text-[11px] text-slate-500">Bypass moderation queue for verified partners</span>
            </div>
            <input
              type="checkbox"
              checked={form.autoApproveVerifiedAgents}
              onChange={(e) =>
                setForm({
                  ...form,
                  autoApproveVerifiedAgents: e.target.checked,
                })
              }
              className="rounded border-slate-300 cursor-pointer"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Audit Log Table */}
      <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Audit Trail ({auditLogs.length})</h2>
          <select
            value={auditFilter}
            onChange={(e) => setAuditFilter(e.target.value)}
            className="h-8 px-2 text-xs border border-slate-200 rounded bg-white cursor-pointer"
          >
            <option value="ALL">All Actions</option>
            <option value="PROPERTY">Properties</option>
            <option value="USER">Users</option>
            <option value="INQUIRY">Inquiries</option>
            <option value="SETTINGS">Settings</option>
          </select>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded uppercase">
                    {log.action}
                  </span>
                  <span className="text-slate-800">{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  By {log.adminName} ({log.adminEmail})
                </span>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
