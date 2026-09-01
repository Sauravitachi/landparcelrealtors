"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "./types";
import { SAMPLE_PROPERTIES } from "./sample-data";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProperties: Property[];
  isWishlisted: (propertyId: string) => boolean;
  toggleWishlist: (property: Property) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(["prop-1", "prop-2"]);

  useEffect(() => {
    const saved = localStorage.getItem("landparcel_wishlist");
    if (saved) {
      try {
        setWishlistIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
  }, []);

  const isWishlisted = (propertyId: string) => {
    return wishlistIds.includes(propertyId);
  };

  const toggleWishlist = (property: Property): boolean => {
    let newIds: string[];
    let added = false;
    if (wishlistIds.includes(property.id)) {
      newIds = wishlistIds.filter((id) => id !== property.id);
      added = false;
    } else {
      newIds = [...wishlistIds, property.id];
      added = true;
    }
    setWishlistIds(newIds);
    localStorage.setItem("landparcel_wishlist", JSON.stringify(newIds));
    return added;
  };

  // Find corresponding property objects from sample or store
  const wishlistProperties = SAMPLE_PROPERTIES.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProperties,
        isWishlisted,
        toggleWishlist,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
