"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Heart,
  Calendar,
  Search,
  Settings,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Trash2,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { DataStore } from "@/lib/store";
import { PropertyCard } from "@/components/property-card";
import { formatCurrency } from "@/lib/utils";

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, updateProfile } = useAuth();
  const { wishlistProperties, count: wishlistCount, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<"wishlist" | "visits" | "saved_searches" | "profile">(
    (searchParams.get("tab") as any) || "wishlist"
  );

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "+91 98765 43210");
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  // Fetch inquiries for this user
  const userInquiries = DataStore.getInquiries(undefined, user?.id || "user-buyer-1");

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || "");
    }
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      phone: profilePhone,
    });
    setProfileSavedSuccess(true);
    setTimeout(() => setProfileSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Hero Banner */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl border-2 border-emerald-500 shadow-sm">
                <Image
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                  alt={user?.name || "User Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user?.name || "Aarav Sharma"}</h1>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    {user?.role || "BUYER"} ACCOUNT
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified VIP Buyer
                  </span>
                  <span>Member since 2025</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <div className="text-xl font-black text-slate-900">{wishlistCount}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Saved Homes</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <div className="text-xl font-black text-emerald-700">{userInquiries.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Visits & Leads</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <div className="text-xl font-black text-amber-700">2</div>
                <div className="text-[10px] text-slate-500 font-semibold">Active Alerts</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Wishlist ({wishlistCount})</span>
            </button>

            <button
              onClick={() => setActiveTab("visits")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "visits"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Scheduled Visits ({userInquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("saved_searches")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "saved_searches"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Saved Custom Searches</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Account Preferences</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Wishlist */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Your Saved Properties ({wishlistCount})</h2>
              <Link
                href="/properties"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                + Browse More Properties
              </Link>
            </div>

            {wishlistProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProperties.map((property) => (
                  <div key={property.id} className="relative group">
                    <PropertyCard property={property} layout="grid" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Your Wishlist is Empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any luxury listing to save it to your private portfolio.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  <span>Explore Featured Listings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Scheduled Visits */}
        {activeTab === "visits" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Scheduled Walkthroughs & Inquiries</h2>
              <span className="text-xs text-slate-500 font-medium">Real-time status updates</span>
            </div>

            {userInquiries.length > 0 ? (
              <div className="space-y-4">
                {userInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200">
                        <Image
                          src={inq.property?.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80"}
                          alt="Property"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === "CONFIRMED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : inq.status === "COMPLETED"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {inq.status}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {inq.visitType === "VIDEO_CALL" ? "Live Video Tour" : "In-Person Visit"}
                          </span>
                        </div>

                        <Link href={`/properties/${inq.propertyId}`}>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                            {inq.property?.title || "Luxury Residence"}
                          </h4>
                        </Link>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{inq.property?.locality}, {inq.property?.city}</span>
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            {inq.visitDate || "Date TBD"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-emerald-600" />
                            {inq.visitTime || "Morning Slot"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-sm font-bold text-emerald-700">
                        {inq.property?.price ? formatCurrency(inq.property.price) : ""}
                      </div>
                      <Link
                        href={`/properties/${inq.propertyId}`}
                        className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
                      >
                        <span>View Property</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Scheduled Visits Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse any property listing and click "Schedule Private Visit" to book your personal walkthrough.
                </p>
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  <span>Explore Listings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Searches */}
        {activeTab === "saved_searches" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Your Saved Search Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/properties?city=Mumbai&propertyType=PENTHOUSE"
                className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-emerald-500 hover:shadow-md transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    Mumbai Luxury
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Mumbai Sea-Facing Penthouses</h3>
                <p className="text-xs text-slate-500">Worli, Bandra, Lower Parel • ₹15 Cr+</p>
              </Link>

              <Link
                href="/properties?city=Goa&propertyType=VILLA"
                className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-emerald-500 hover:shadow-md transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    Goa Estates
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Portuguese Heritage Villas</h3>
                <p className="text-xs text-slate-500">Assagao, Anjuna, Siolim • Private Pool</p>
              </Link>

              <Link
                href="/properties?city=Bangalore&bedrooms=3"
                className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-emerald-500 hover:shadow-md transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                    Bangalore
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">3BHK High-Rise Residencies</h3>
                <p className="text-xs text-slate-500">Indiranagar, Whitefield • ₹2 Cr - ₹5 Cr</p>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 4: Profile Settings */}
        {activeTab === "profile" && (
          <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Profile & Advisory Preferences</h2>

            {profileSavedSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Profile preferences updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Mobile Number (For Gate Entry Passes)
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || "buyer@landparcel.com"}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
