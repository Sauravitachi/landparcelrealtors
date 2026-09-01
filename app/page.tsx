"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  ChevronRight,
  Home,
  Trees,
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";
import { SAMPLE_PROPERTIES, POPULAR_CITIES, PROPERTY_CATEGORIES } from "@/lib/sample-data";
import { PropertyCard } from "@/components/property-card";
import { EMICalculator } from "@/components/emi-calculator";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();

  // Search Bar State
  const [activeSearchTab, setActiveSearchTab] = useState<"BUY" | "RENT" | "COMMERCIAL" | "PLOT">("BUY");
  const [searchCity, setSearchCity] = useState("All Cities");
  const [searchType, setSearchType] = useState("ALL");
  const [searchBudget, setSearchBudget] = useState("ALL");
  const [searchBHK, setSearchBHK] = useState("ALL");

  // Featured category filter
  const [featuredCategory, setFeaturedCategory] = useState<string>("ALL");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (activeSearchTab === "BUY") {
      params.set("listingType", "SALE");
    } else if (activeSearchTab === "RENT") {
      params.set("listingType", "RENT");
    } else if (activeSearchTab === "COMMERCIAL") {
      params.set("propertyType", "COMMERCIAL");
    } else if (activeSearchTab === "PLOT") {
      params.set("propertyType", "PLOT");
    }

    if (searchCity !== "All Cities") {
      params.set("city", searchCity);
    }
    if (searchType !== "ALL") {
      params.set("propertyType", searchType);
    }
    if (searchBHK !== "ALL") {
      params.set("bedrooms", searchBHK);
    }

    if (searchBudget === "under_1cr") {
      params.set("maxPrice", "10000000");
    } else if (searchBudget === "1cr_3cr") {
      params.set("minPrice", "10000000");
      params.set("maxPrice", "30000000");
    } else if (searchBudget === "3cr_10cr") {
      params.set("minPrice", "30000000");
      params.set("maxPrice", "100000000");
    } else if (searchBudget === "10cr_plus") {
      params.set("minPrice", "100000000");
    }

    router.push(`/properties?${params.toString()}`);
  };

  const filteredFeaturedProperties = SAMPLE_PROPERTIES.filter((prop) => {
    if (prop.status !== "APPROVED") return false;
    if (featuredCategory === "ALL") return true;
    return prop.propertyType === featuredCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90"
            alt="Luxury Architecture"
            fill
            priority
            className="object-cover object-center scale-105 animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/60 to-slate-950/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full text-center space-y-8">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/90 px-4 py-1.5 text-xs font-bold text-emerald-800 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>India's Premier Luxury Real Estate & Land Advisory</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span className="text-slate-600">RERA Verified</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-md">
              Find Your Exclusive <br />
              <span className="gradient-text-emerald">Architectural Sanctuary</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
              Curated portfolio of sea-facing sky penthouses, bespoke Portuguese villas, prime gated land parcels, and grade-A commercial hubs.
            </p>
          </div>

          {/* Unified Multi-Tab Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-3 sm:p-5 backdrop-blur-2xl shadow-2xl text-slate-900">
              {/* Search Category Tabs */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 pb-4 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSearchTab("BUY")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    activeSearchTab === "BUY"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Buy Property</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSearchTab("RENT")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    activeSearchTab === "RENT"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Rent Luxury</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSearchTab("PLOT")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    activeSearchTab === "PLOT"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Trees className="h-4 w-4" />
                  <span>Gated Plots</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSearchTab("COMMERCIAL")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    activeSearchTab === "COMMERCIAL"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Commercial Assets</span>
                </button>
              </div>

              {/* Filter Row Form */}
              <form onSubmit={handleHeroSearch} className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
                {/* City Selector */}
                <div className="flex flex-col text-left rounded-2xl bg-slate-50 border border-slate-200 p-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-600" />
                    City Location
                  </label>
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="mt-1 bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="All Cities" className="bg-white">All Cities</option>
                    <option value="Mumbai" className="bg-white">Mumbai</option>
                    <option value="Bangalore" className="bg-white">Bangalore</option>
                    <option value="Delhi NCR" className="bg-white">Delhi NCR</option>
                    <option value="Hyderabad" className="bg-white">Hyderabad</option>
                    <option value="Pune" className="bg-white">Pune</option>
                    <option value="Goa" className="bg-white">Goa</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="flex flex-col text-left rounded-2xl bg-slate-50 border border-slate-200 p-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-emerald-600" />
                    Property Type
                  </label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mt-1 bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-white">All Types</option>
                    <option value="VILLA" className="bg-white">Luxury Villa</option>
                    <option value="PENTHOUSE" className="bg-white">Sky Penthouse</option>
                    <option value="APARTMENT" className="bg-white">Apartment</option>
                    <option value="PLOT" className="bg-white">Gated Plot</option>
                    <option value="COMMERCIAL" className="bg-white">Commercial Office</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="flex flex-col text-left rounded-2xl bg-slate-50 border border-slate-200 p-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    Budget Range
                  </label>
                  <select
                    value={searchBudget}
                    onChange={(e) => setSearchBudget(e.target.value)}
                    className="mt-1 bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-white">Any Budget</option>
                    <option value="under_1cr" className="bg-white">Under ₹1 Cr</option>
                    <option value="1cr_3cr" className="bg-white">₹1 Cr - ₹3 Cr</option>
                    <option value="3cr_10cr" className="bg-white">₹3 Cr - ₹10 Cr</option>
                    <option value="10cr_plus" className="bg-white">₹10 Cr+ Ultra Luxury</option>
                  </select>
                </div>

                {/* BHK Config */}
                <div className="flex flex-col text-left rounded-2xl bg-slate-50 border border-slate-200 p-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Home className="h-3 w-3 text-emerald-600" />
                    Bedrooms (BHK)
                  </label>
                  <select
                    value={searchBHK}
                    onChange={(e) => setSearchBHK(e.target.value)}
                    className="mt-1 bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-white">Any BHK</option>
                    <option value="1" className="bg-white">1 BHK</option>
                    <option value="2" className="bg-white">2 BHK</option>
                    <option value="3" className="bg-white">3 BHK</option>
                    <option value="4" className="bg-white">4 BHK</option>
                    <option value="5" className="bg-white">5+ BHK Grand</option>
                  </select>
                </div>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Search Estates</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-center">
            <div className="rounded-2xl border border-white/40 bg-white/90 p-3 backdrop-blur-md shadow-md">
              <div className="text-xl sm:text-2xl font-black text-slate-900">₹4,800+ Cr</div>
              <div className="text-[11px] text-slate-600 font-semibold">Assets Transacted</div>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/90 p-3 backdrop-blur-md shadow-md">
              <div className="text-xl sm:text-2xl font-black text-emerald-700">2,400+</div>
              <div className="text-[11px] text-slate-600 font-semibold">Verified Residences</div>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/90 p-3 backdrop-blur-md shadow-md">
              <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
              <div className="text-[11px] text-slate-600 font-semibold">RERA & Title Clear</div>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/90 p-3 backdrop-blur-md shadow-md">
              <div className="text-xl sm:text-2xl font-black text-amber-700">99.4%</div>
              <div className="text-[11px] text-slate-600 font-semibold">Client Trust Index</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY EXPLORATION CARDS */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Architectural Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Explore by Property Category
              </h2>
            </div>
            <Link
              href="/properties"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>View All 3,200+ Listings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROPERTY_CATEGORIES.map((cat) => (
              <Link
                key={cat.type}
                href={`/properties?propertyType=${cat.type}`}
                className="group relative h-72 overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-500 hover:border-emerald-500/50 hover:shadow-xl shadow-xs"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {cat.count}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-200 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED & TRENDING PROPERTIES */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Handpicked Exclusives</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Trending Luxury Residences & Estates
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "ALL", label: "All Properties" },
                { id: "VILLA", label: "Luxury Villas" },
                { id: "PENTHOUSE", label: "Penthouses" },
                { id: "APARTMENT", label: "Apartments" },
                { id: "PLOT", label: "Land Parcels" },
                { id: "COMMERCIAL", label: "Commercial" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFeaturedCategory(pill.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    featuredCategory === pill.id
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeaturedProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-3.5 text-sm font-bold text-slate-900 shadow-md hover:border-emerald-500 hover:bg-white transition-all hover:scale-105"
            >
              <span>Explore All Verified Properties</span>
              <ArrowRight className="h-4 w-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PREMIER CITIES EXPLORER */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Prime Metro Markets
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              Explore High-Growth Real Estate Hubs
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Deep local expertise across India's most coveted micro-markets and waterfront developments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/properties?city=${encodeURIComponent(city.name)}`}
                className="group relative h-64 overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-500 hover:border-emerald-500/50 hover:shadow-xl shadow-xs"
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-xs text-slate-300">{city.state}</p>
                    </div>
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-700 border border-slate-200 shadow-xs">
                      {city.propertyCount}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-200 line-clamp-1 italic">
                    "{city.tagline}"
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

   

      {/* 6. WHY CHOOSE US (TRUST PROPOSITIONS) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                The LandParcel Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Setting New Standards in <br />
                <span className="gradient-text-emerald">High-End Real Estate</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you're acquiring a trophy penthouse in Worli, a Portuguese heritage villa in North Goa, or acquiring a prime 5-acre commercial parcel, our team provides discreet institutional-grade representation.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5 border border-emerald-200 shadow-xs">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">100% Verified Legal & Title Due Diligence</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Every asset is vetted by premier real estate law counsels for clear RERA titles, encumbrances, and municipal sanctions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5 border border-amber-200 shadow-xs">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">0% Brokerage on Builder Launch Collections</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct developer inventory access with price-lock guarantees and exclusive launch priority allocations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shrink-0 mt-0.5 border border-teal-200 shadow-xs">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">White-Glove Private Walkthrough Concierge</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chauffeured site inspections, high-resolution virtual 3D walkthroughs, and end-to-end registry management.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
                  alt="Luxury Living Interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Floating Testimonial Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-slate-200 bg-white/95 p-5 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Homebuyer"
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Aarav & Meera Sharma</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">Worli Waterfront Penthouse Buyers</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 italic">
                    "LandParcel arranged a private dusk walkthrough and finalized our sea-facing penthouse in Worli within 2 weeks. The legal title verification was completely seamless."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEVELOPER PARTNERS */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Authorized Channel Partner for Premier Developers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 transition-all">
            {["DLF Estates", "Prestige Group", "Lodha Luxury", "Godrej Properties", "Oberoi Realty", "Embassy Group"].map((partner) => (
              <span key={partner} className="text-sm font-bold text-slate-700 tracking-wider hover:text-emerald-700 transition-colors">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
