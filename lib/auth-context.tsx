"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "./types";
import { DataStore } from "./store";

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  licenseNumber?: string;
  bio?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => AuthResponse;
  register: (data: RegisterData) => AuthResponse;
  loginAs: (role: UserRole) => void;
  loginWithEmail: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => AuthResponse;
  changePassword: (oldPassword: string, newPassword: string) => AuthResponse;
  resetPassword: (email: string, newPassword?: string) => AuthResponse;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("landparcel_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as User;
        // Verify user still exists in DataStore or sync
        const inStore = DataStore.getUserById(parsed.id) || DataStore.getUserByEmail(parsed.email);
        if (inStore) {
          setCurrentUser(inStore);
        } else {
          setCurrentUser(parsed);
        }
      } else {
        // Default to Buyer role for initial visitor experience
        const defaultBuyer = DataStore.getUsers().find((u) => u.role === "BUYER") || DataStore.getUsers()[0];
        if (defaultBuyer) {
          setCurrentUser(defaultBuyer);
          localStorage.setItem("landparcel_user", JSON.stringify(defaultBuyer));
        }
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1-Click Fast Role Switch (For instantaneous demo testing)
  const loginAs = useCallback((role: UserRole) => {
    const targetUser = DataStore.getUsers().find((u) => u.role === role) || {
      id: `user-${role.toLowerCase()}-custom`,
      name: `${role === "ADMIN" ? "Priya Menon" : role === "AGENT" ? "Vikram Singhania" : "Aarav Sharma"}`,
      email: `${role.toLowerCase()}@landparcel.com`,
      role: role,
      phone: "+91 98765 43210",
      isVerified: true,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(targetUser);
    localStorage.setItem("landparcel_user", JSON.stringify(targetUser));
  }, []);

  // Standard credential login
  const login = useCallback((email: string, password?: string): AuthResponse => {
    if (!email || !email.trim()) {
      return { success: false, error: "Email address is required." };
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = DataStore.getUserByEmail(cleanEmail);

    if (!existing) {
      return { success: false, error: "No account found with this email. Please register first." };
    }

    if (existing.isBlocked) {
      return { success: false, error: "This account has been restricted by platform administration. Contact support." };
    }

    // Password validation (Default demo password is 'Password123!' or whatever was stored)
    if (password && existing.password && existing.password !== password) {
      // Allow demo bypass if matches 'Password123!'
      if (password !== "Password123!") {
        return { success: false, error: "Invalid password. Please check and try again." };
      }
    }

    setCurrentUser(existing);
    localStorage.setItem("landparcel_user", JSON.stringify(existing));
    return { success: true, message: `Welcome back, ${existing.name}!` };
  }, []);

  // User Registration
  const register = useCallback((data: RegisterData): AuthResponse => {
    if (!data.email || !data.email.trim()) {
      return { success: false, error: "Email is required." };
    }
    if (!data.name || !data.name.trim()) {
      return { success: false, error: "Full Name is required." };
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const existing = DataStore.getUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: "An account with this email address already exists. Please sign in." };
    }

    const newUser = DataStore.createUser({
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone || "+91 98765 00000",
      role: data.role || "BUYER",
      password: data.password || "Password123!",
      companyName: data.companyName,
      licenseNumber: data.licenseNumber,
      bio: data.bio || (data.role === "AGENT" ? "Certified Real Estate Advisor with LandParcel Luxury Realty." : "Luxury property enthusiast."),
      avatar: data.avatar || (data.role === "AGENT"
        ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"),
      isVerified: data.role === "BUYER" ? true : false, // Agents start as unverified until admin checks RERA
      isBlocked: false,
    });

    setCurrentUser(newUser);
    localStorage.setItem("landparcel_user", JSON.stringify(newUser));
    return { success: true, message: "Account created successfully!" };
  }, []);

  // Legacy helper for quick compatibility
  const loginWithEmail = useCallback((email: string, role: UserRole = "BUYER") => {
    const res = login(email);
    if (!res.success) {
      register({
        name: email.split("@")[0],
        email: email,
        role: role,
        password: "Password123!",
      });
    }
    return true;
  }, [login, register]);

  // Logout
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("landparcel_user");
  }, []);

  // Update profile
  const updateProfile = useCallback((updatedData: Partial<User>): AuthResponse => {
    if (!currentUser) {
      return { success: false, error: "No active user session found." };
    }

    const updated = DataStore.updateUser(currentUser.id, updatedData);
    if (!updated) {
      return { success: false, error: "Failed to update user profile." };
    }

    setCurrentUser(updated);
    localStorage.setItem("landparcel_user", JSON.stringify(updated));
    return { success: true, message: "Profile updated successfully." };
  }, [currentUser]);

  // Change Password
  const changePassword = useCallback((oldPassword: string, newPassword: string): AuthResponse => {
    if (!currentUser) {
      return { success: false, error: "Not authenticated." };
    }
    if (currentUser.password && currentUser.password !== oldPassword && oldPassword !== "Password123!") {
      return { success: false, error: "Current password does not match." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters." };
    }

    const updated = DataStore.updateUser(currentUser.id, { password: newPassword });
    if (updated) {
      setCurrentUser(updated);
      localStorage.setItem("landparcel_user", JSON.stringify(updated));
      return { success: true, message: "Password changed successfully." };
    }
    return { success: false, error: "Failed to update password." };
  }, [currentUser]);

  // Forgot / Reset Password
  const resetPassword = useCallback((email: string, newPassword: string = "Password123!"): AuthResponse => {
    const cleanEmail = email.toLowerCase().trim();
    const user = DataStore.getUserByEmail(cleanEmail);
    if (!user) {
      return { success: false, error: "No user found with this email." };
    }

    DataStore.updateUser(user.id, { password: newPassword });
    return { success: true, message: `Password has been reset to: ${newPassword}` };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role: currentUser?.role || "BUYER",
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        loginAs,
        loginWithEmail,
        logout,
        updateProfile,
        changePassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

