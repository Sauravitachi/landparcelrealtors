"use client";

import React, { useState } from "react";
import { Search, Phone, Mail, Trash2 } from "lucide-react";
import { Inquiry, InquiryStatus } from "@/lib/types";

interface AdminLeadsTabProps {
  inquiries: Inquiry[];
  pendingCount: number;
  confirmedCount: number;
  onStatusChange: (leadId: string, status: InquiryStatus) => void;
  onEditNotes: (inquiry: Inquiry) => void;
  onDeleteLead: (id: string) => void;
}

export function AdminLeadsTab({
  inquiries,
  pendingCount,
  confirmedCount,
  onStatusChange,
  onEditNotes,
  onDeleteLead,
}: AdminLeadsTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "ALL">("ALL");

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== "ALL" && inq.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.includes(q) ||
        (inq.property?.title && inq.property.title.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Leads & Inquiries CRM</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track buyer leads, private tour bookings, and log follow-up notes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buyer name, email, phone, property..."
            className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="ALL">All Inquiries ({inquiries.length})</option>
          <option value="PENDING">Pending ({pendingCount})</option>
          <option value="CONFIRMED">Confirmed ({confirmedCount})</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Tour Slot</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{inq.name}</span>
                      <span className="text-[11px] text-slate-500 block">{inq.email}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">{inq.phone}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900 block truncate max-w-xs">
                        {inq.property?.title || `ID: ${inq.propertyId}`}
                      </span>
                      <p className="text-[11px] text-slate-500 italic truncate max-w-xs mt-0.5">
                        "{inq.message}"
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800 block">
                        {inq.visitDate || "General Inquiry"}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {inq.visitTime || "Flexible"} ({inq.visitType === "VIDEO_CALL" ? "Video" : "In-Person"})
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={inq.status}
                        onChange={(e) => onStatusChange(inq.id, e.target.value as InquiryStatus)}
                        className="h-7 px-2 border border-slate-200 rounded bg-white text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded text-xs font-medium inline-flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${inq.email}?subject=Regarding ${encodeURIComponent(
                            inq.property?.title || "Property"
                          )}`}
                          className="h-7 px-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-medium inline-flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          <span>Email</span>
                        </a>

                        <button
                          onClick={() => onEditNotes(inq)}
                          className="h-7 px-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-medium cursor-pointer"
                        >
                          Notes
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm("Delete this inquiry record?")) {
                              onDeleteLead(inq.id);
                            }
                          }}
                          className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
