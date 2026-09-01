"use client";

import React from "react";
import { X } from "lucide-react";
import { Property, PropertyType, ListingType, FurnishingStatus, PropertyStatus } from "@/lib/types";

interface NewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => void;
  userId?: string;
}

export function NewPropertyModal({ isOpen, onClose, onSubmit, userId }: NewPropertyModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newProp: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string) || 10000000,
      propertyType: formData.get("propertyType") as PropertyType,
      listingType: formData.get("listingType") as ListingType,
      city: formData.get("city") as string,
      locality: formData.get("locality") as string,
      address: formData.get("address") as string,
      lat: 19.076,
      lng: 72.8777,
      bedrooms: parseInt(formData.get("bedrooms") as string, 10) || 3,
      bathrooms: 3,
      areaSqFt: parseFloat(formData.get("areaSqFt") as string) || 2500,
      parking: 2,
      furnishingStatus: "FURNISHED" as FurnishingStatus,
      status: "APPROVED" as PropertyStatus,
      featured: true,
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      ],
      amenities: ["Security", "Clubhouse", "Swimming Pool"],
      ownerId: userId || "user-admin-1",
    };

    onSubmit(newProp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Add New Property Listing</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Title</label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Prestige Golfshire Villa"
              className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Asset Type</label>
              <select name="propertyType" className="w-full h-9 px-2 border border-slate-200 rounded bg-white">
                <option value="VILLA">Villa</option>
                <option value="APARTMENT">Apartment</option>
                <option value="PENTHOUSE">Penthouse</option>
                <option value="PLOT">Plot</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Listing Type</label>
              <select name="listingType" className="w-full h-9 px-2 border border-slate-200 rounded bg-white">
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Price (₹)</label>
              <input
                name="price"
                type="number"
                defaultValue={25000000}
                className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">City</label>
              <input
                name="city"
                type="text"
                defaultValue="Mumbai"
                className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Locality</label>
              <input
                name="locality"
                type="text"
                defaultValue="Bandra West"
                className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Address</label>
            <input
              name="address"
              type="text"
              defaultValue="12 Pali Hill, Bandra West, Mumbai 400050"
              className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue="Exclusive luxury residence in prime locality."
              className="w-full p-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
