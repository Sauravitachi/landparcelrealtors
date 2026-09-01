"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Calendar, Clock, Video, User, Phone, Mail, CheckCircle2, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { DataStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function ScheduleVisitModal({ isOpen, onClose, property }: ScheduleVisitModalProps) {
  const { user } = useAuth();

  const [visitType, setVisitType] = useState<"IN_PERSON" | "VIDEO_CALL">("IN_PERSON");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("11:00 AM - 01:00 PM");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !name || !email || !phone) return;

    // Save inquiry to DataStore
    DataStore.createInquiry({
      propertyId: property.id,
      userId: user?.id || null,
      name,
      email,
      phone,
      message: notes || `Requested ${visitType === "IN_PERSON" ? "in-person" : "video"} visit on ${selectedDate} at ${selectedSlot}`,
      visitDate: selectedDate,
      visitTime: selectedSlot,
      visitType,
    });

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Schedule a Property Walkthrough</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Visit Confirmed!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your appointment for <strong className="text-emerald-700">{property.title}</strong> has been received. Our luxury real estate concierge will call you on <strong className="text-slate-900">{phone}</strong> with directions and gate entry pass.
            </p>
            <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 border border-slate-200 space-y-1.5 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>Date & Slot:</span>
                <strong className="text-slate-800">{selectedDate} ({selectedSlot})</strong>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <strong className="text-emerald-700 capitalize">{visitType.replace("_", " ").toLowerCase()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Agent Contact:</span>
                <strong className="text-slate-800">{property.owner?.name || "Singhania Estates"}</strong>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Property Summary Mini Card */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-200">
              <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{property.title}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <MapPin className="h-3 w-3 text-emerald-600" />
                  <span className="truncate">{property.locality}, {property.city}</span>
                </div>
                <div className="text-xs font-extrabold text-emerald-600 mt-0.5">
                  {formatCurrency(property.price)}
                </div>
              </div>
            </div>

            {/* Visit Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tour Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisitType("IN_PERSON")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                    visitType === "IN_PERSON"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>In-Person Visit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType("VIDEO_CALL")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                    visitType === "VIDEO_CALL"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>Live Video Walkthrough</span>
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                <span>Preferred Time Slot</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors text-left ${
                      selectedSlot === slot
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Requests or Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please arrange for wheelchair accessibility or floorplan blueprints..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm & Book Appointment</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
