import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EMICalculationResult } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `₹${lk.toFixed(lk % 1 === 0 ? 0 : 2)} Lakh`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(sqFt: number): string {
  return `${new Intl.NumberFormat("en-IN").format(sqFt)} sq.ft`;
}

export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): EMICalculationResult {
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEMI = 0;
  if (monthlyRate === 0) {
    monthlyEMI = principal / totalMonths;
  } else {
    monthlyEMI =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPayment = monthlyEMI * totalMonths;
  const totalInterest = totalPayment - principal;

  const principalPercentage = totalPayment > 0 ? (principal / totalPayment) * 100 : 0;
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  return {
    loanAmount: Math.round(principal),
    interestRate: annualInterestRate,
    tenureYears,
    monthlyEMI: Math.round(monthlyEMI),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principalPercentage: Math.round(principalPercentage),
    interestPercentage: Math.round(interestPercentage),
  };
}
