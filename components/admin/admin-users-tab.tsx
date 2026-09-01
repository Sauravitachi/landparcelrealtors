"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Trash2 } from "lucide-react";
import { User, UserRole } from "@/lib/types";

interface AdminUsersTabProps {
  users: User[];
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onToggleVerification: (userId: string) => void;
  onToggleBlock: (userId: string) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export function AdminUsersTab({
  users,
  onRoleChange,
  onToggleVerification,
  onToggleBlock,
  onEditUser,
  onDeleteUser,
}: AdminUsersTabProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

  const filtered = users.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q)) ||
        (u.companyName && u.companyName.toLowerCase().includes(q)) ||
        (u.licenseNumber && u.licenseNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">User & Agent Directory</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage accounts, grant agent/admin privileges, and verify RERA credentials.
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
            placeholder="Search by name, email, agency, RERA..."
            className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="ALL">All Roles ({users.length})</option>
          <option value="BUYER">Buyers</option>
          <option value="AGENT">Agents</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                        <Image
                          src={
                            u.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={u.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-400 block">{u.email}</span>
                        {u.companyName && (
                          <span className="text-[10px] text-slate-500 block">
                            {u.companyName} {u.licenseNumber ? `• ${u.licenseNumber}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => onRoleChange(u.id, e.target.value as UserRole)}
                      className="h-7 px-2 border border-slate-200 rounded bg-white text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="BUYER">BUYER</option>
                      <option value="AGENT">AGENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => onToggleVerification(u.id)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border cursor-pointer ${
                        u.isVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {u.isVerified ? "Verified" : "Unverified"}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => onToggleBlock(u.id)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border cursor-pointer ${
                        u.isBlocked
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {u.isBlocked ? "Restricted" : "Active"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditUser(u)}
                        className="h-7 px-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 text-xs font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete user ${u.name}?`)) {
                            onDeleteUser(u.id);
                          }
                        }}
                        className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
