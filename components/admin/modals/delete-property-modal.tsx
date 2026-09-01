"use client";

import React from "react";

interface DeletePropertyModalProps {
  propertyId: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeletePropertyModal({
  propertyId,
  onClose,
  onConfirm,
}: DeletePropertyModalProps) {
  if (!propertyId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 shadow-lg text-center space-y-4">
        <h3 className="text-base font-bold text-slate-900">Delete Property?</h3>
        <p className="text-xs text-slate-500">
          Are you sure you want to permanently delete this listing?
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={onClose}
            className="h-8 px-3 border border-slate-200 rounded text-slate-600 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(propertyId)}
            className="h-8 px-4 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
