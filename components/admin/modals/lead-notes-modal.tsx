"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Inquiry } from "@/lib/types";

interface LeadNotesModalProps {
  inquiry: Inquiry | null;
  onClose: () => void;
  onSave: (leadId: string, notes: string) => void;
}

export function LeadNotesModal({ inquiry, onClose, onSave }: LeadNotesModalProps) {
  const [notesText, setNotesText] = useState("");

  useEffect(() => {
    setNotesText(inquiry?.adminNotes || "");
  }, [inquiry]);

  if (!inquiry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(inquiry.id, notesText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Follow-up Notes for {inquiry.name}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <textarea
            rows={4}
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Log client budget, inspection notes, conversation summary..."
            className="w-full p-2.5 border border-slate-200 rounded bg-white focus:outline-none focus:border-slate-900"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 border border-slate-200 rounded text-slate-600 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded cursor-pointer"
            >
              Save Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
