"use client";

import React, { useState, useMemo } from "react";
import { Calculator, IndianRupee, PieChart, ShieldCheck, ArrowRight, Percent, Clock } from "lucide-react";
import { calculateEMI, formatCurrency } from "@/lib/utils";

interface EMICalculatorProps {
  initialPrice?: number;
}

export function EMICalculator({ initialPrice = 15000000 }: EMICalculatorProps) {
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const downPaymentAmount = useMemo(
    () => Math.round((propertyPrice * downPaymentPercent) / 100),
    [propertyPrice, downPaymentPercent]
  );

  const principalLoanAmount = useMemo(
    () => propertyPrice - downPaymentAmount,
    [propertyPrice, downPaymentAmount]
  );

  const emiResult = useMemo(
    () => calculateEMI(principalLoanAmount, interestRate, tenureYears),
    [principalLoanAmount, interestRate, tenureYears]
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Mortgage & Home Loan EMI Estimator</h3>
            <p className="text-xs text-slate-500">
              Calculate accurate monthly installments, loan eligibility & interest amortization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 border border-slate-200 text-xs text-slate-700 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Competitive Rates from 8.35% p.a.</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Input Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Property Value Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Total Property Value</label>
              <span className="font-bold text-emerald-600 text-sm">
                {formatCurrency(propertyPrice)}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={350000000}
              step={500000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹10 Lakh</span>
              <span>₹15 Cr</span>
              <span>₹35 Cr</span>
            </div>
          </div>

          {/* Down Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">
                Down Payment ({downPaymentPercent}%)
              </label>
              <span className="font-bold text-slate-900">
                {formatCurrency(downPaymentAmount)}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>10% (Min)</span>
              <span>20% (Recommended)</span>
              <span>80%</span>
            </div>
          </div>

          {/* Interest Rate & Loan Tenure in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <Percent className="h-3 w-3 text-emerald-600" />
                  Interest Rate (p.a.)
                </label>
                <span className="font-bold text-emerald-600">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={7.0}
                max={15.0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>7.0%</span>
                <span>8.5% Avg</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-emerald-600" />
                  Loan Duration
                </label>
                <span className="font-bold text-slate-900">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>5 Yrs</span>
                <span>20 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Calculated Summary Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 border border-slate-800 shadow-xl">
          <div>
            <div className="text-center pb-4 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Estimated Monthly EMI
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1 tracking-tight">
                ₹{emiResult.monthlyEMI.toLocaleString()}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </div>
            </div>

            {/* Progress split bar */}
            <div className="my-5 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Principal ({emiResult.principalPercentage}%)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Interest ({emiResult.interestPercentage}%)
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 flex">
                <div
                  className="bg-emerald-500 transition-all duration-300"
                  style={{ width: `${emiResult.principalPercentage}%` }}
                />
                <div
                  className="bg-amber-500 transition-all duration-300"
                  style={{ width: `${emiResult.interestPercentage}%` }}
                />
              </div>
            </div>

            {/* Detailed figures */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Principal Loan Amount:</span>
                <span className="font-semibold text-white">{formatCurrency(emiResult.loanAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-semibold text-amber-400">{formatCurrency(emiResult.totalInterest)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Total Payable (Principal + Interest):</span>
                <span className="font-bold text-white">{formatCurrency(emiResult.totalPayment)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => alert(`Pre-Approved Home Loan request initiated for ${formatCurrency(emiResult.loanAmount)} with top partner banks (HDFC, SBI, ICICI, Axis)!`)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
            >
              <span>Apply For Pre-Approved Home Loan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Instant loan sanctions • 0% processing fee for select partners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
