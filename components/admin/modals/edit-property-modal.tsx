"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Property } from "@/lib/types";

interface EditPropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onSave: (updated: Property) => void;
}

export function EditPropertyModal({ property, onClose, onSave }: EditPropertyModalProps) {
  const [formData, setFormData] = useState<Property | null>(null);

  useEffect(() => {
    setFormData(property ? { ...property } : null);
  }, [property]);

  if (!property || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Edit Property Details</h2>
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
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Area (sq.ft)</label>
              <input
                type="number"
                value={formData.areaSqFt}
                onChange={(e) =>
                  setFormData({ ...formData, areaSqFt: parseFloat(e.target.value) || 0 })
                }
                className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full h-9 px-3 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
