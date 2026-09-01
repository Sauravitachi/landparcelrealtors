"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  User,
  Phone,
  Building2,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
];

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, role, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // Password Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || PRESET_AVATARS[0]);
      setCompanyName(user.companyName || "");
      setLicenseNumber(user.licenseNumber || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const resetState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setIsSaving(true);

    const res = updateProfile({
      name,
      phone,
      bio,
      avatar,
      companyName: role === "AGENT" ? companyName : undefined,
      licenseNumber: role === "AGENT" ? licenseNumber : undefined,
    });

    setIsSaving(false);
    if (res.success) {
      setSuccessMsg("Profile saved successfully.");
      setTimeout(() => setSuccessMsg(null), 2500);
    } else {
      setErrorMsg(res.error || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsSaving(true);
    const res = changePassword(oldPassword, newPassword);
    setIsSaving(false);

    if (res.success) {
      setSuccessMsg("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMsg(null), 2500);
    } else {
      setErrorMsg(res.error || "Could not update password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative">
              <Image src={avatar || PRESET_AVATARS[0]} alt={name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{user.name}</h2>
              <span className="text-[11px] text-slate-500">{user.email} • {role}</span>
            </div>
          </div>

          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 text-xs font-medium bg-slate-50">
          <button
            onClick={() => {
              resetState();
              setActiveTab("profile");
            }}
            className={`py-2.5 mr-4 transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "border-b-2 border-slate-900 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => {
              resetState();
              setActiveTab("security");
            }}
            className={`py-2.5 transition-colors cursor-pointer ${
              activeTab === "security"
                ? "border-b-2 border-slate-900 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Password & Security
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-3.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Select Avatar</label>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(img)}
                      className={`h-9 w-9 rounded-full overflow-hidden relative border-2 transition-all cursor-pointer ${
                        avatar === img ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Avatar" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
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
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {role === "AGENT" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Agency Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">RERA Number</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell clients about your background..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 px-3 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
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
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 px-3 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
