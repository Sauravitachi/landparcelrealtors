"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Property } from "@/lib/types";
import { formatCurrency, formatArea } from "@/lib/utils";

interface InspectPropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleFeatured: (property: Property) => void;
  onToggleVerified: (property: Property) => void;
}

export function InspectPropertyModal({
  property,
  onClose,
  onApprove,
  onReject,
  onToggleFeatured,
  onToggleVerified,
}: InspectPropertyModalProps) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">{property.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-2">
            {property.images.map((img, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded relative overflow-hidden">
                <Image src={img} alt="Property" fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-slate-500 block text-[10px]">Price</span>
              <span className="font-bold text-slate-900 text-sm">{formatCurrency(property.price)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Area</span>
              <span className="font-bold text-slate-900 text-sm">{formatArea(property.areaSqFt)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Configuration</span>
              <span className="font-bold text-slate-900 text-sm">{property.bedrooms} BHK</span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-1">Address</span>
            <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
              {property.address} ({property.locality}, {property.city})
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-1">Description</span>
            <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFeatured(property)}
              className={`px-3 py-1.5 rounded font-medium border cursor-pointer ${
                property.featured
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {property.featured ? "Featured ★" : "Mark Featured"}
            </button>
            <button
              onClick={() => onToggleVerified(property)}
              className={`px-3 py-1.5 rounded font-medium border cursor-pointer ${
                property.verified
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {property.verified ? "Title Verified ✓" : "Verify Title"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onApprove(property.id);
                onClose();
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded cursor-pointer"
            >
              Approve Listing
            </button>
            <button
              onClick={() => {
                onReject(property.id);
                onClose();
              }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
