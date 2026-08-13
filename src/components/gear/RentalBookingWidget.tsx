"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRentalOrder } from "@/lib/actions/customerActions";
import { toast } from "sonner";

interface RentalBookingWidgetProps {
  gearItemId: string;
  pricePerDay: number;
  isAvailable: boolean;
}

export default function RentalBookingWidget({
  gearItemId,
  pricePerDay,
  isAvailable,
}: RentalBookingWidgetProps) {
  const router = useRouter();

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numPrice = Number(pricePerDay) || 0;

  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const end = endDate ? new Date(`${endDate}T00:00:00`) : null;

  let days = 0;
  let dateValidationError = "";

  if (startDate && startDate < todayStr) {
    dateValidationError = "Start date cannot be in the past.";
  } else if (startDate && endDate) {
    if (startDate > endDate) {
      dateValidationError = "End date cannot be before start date.";
    } else if (startDate === endDate) {
      dateValidationError = "Rental duration must be at least 1 day.";
    } else if (start && end) {
      const timeDiff = end.getTime() - start.getTime();
      days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  }

  const totalPrice = days > 0 ? days * numPrice : 0;
  const isValidForm =
    isAvailable && startDate && endDate && days > 0 && !dateValidationError;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (startDate < todayStr) {
      toast.error("Start date cannot be in the past.");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedStartDate = new Date(
        `${startDate}T00:00:00.000Z`,
      ).toISOString();
      const formattedEndDate = new Date(
        `${endDate}T00:00:00.000Z`,
      ).toISOString();

      const res = await createRentalOrder({
        gearItemId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      if (res?.success) {
        toast.success(res?.message || "Rental order created successfully!");
        router.push("/dashboard/customer/orders");
      } else {
        toast.error(
          res?.message ||
            "Failed to create rental order. Please sign in as a customer.",
        );
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("An unexpected error occurred while placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateOrder}
      className="rounded-2xl border border-teal-500/30 bg-slate-900/80 p-5 space-y-4 backdrop-blur-xl shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
          <Sparkles className="h-4 w-4" />
          <span>Choose Rental Dates</span>
        </div>
        {days > 0 && !dateValidationError && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            {days} {days === 1 ? "day" : "days"} duration
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
            <CalendarIcon className="h-3.5 w-3.5 text-teal-400" />
            <span>Start Date</span>
          </label>
          <Input
            type="date"
            min={todayStr}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
            className="bg-slate-950 border-slate-800 text-slate-100 text-xs focus:border-teal-500 cursor-pointer"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
            <CalendarIcon className="h-3.5 w-3.5 text-teal-400" />
            <span>End Date</span>
          </label>
          <Input
            type="date"
            min={startDate || todayStr}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
            className="bg-slate-950 border-slate-800 text-slate-100 text-xs focus:border-teal-500 cursor-pointer"
            required
          />
        </div>
      </div>

      {dateValidationError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{dateValidationError}</span>
        </div>
      )}

      {days > 0 && !dateValidationError && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Daily Rate:</span>
            <span className="font-semibold text-slate-200">
              ${numPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Rental Duration:</span>
            <span className="font-semibold text-slate-200">{days} days</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-slate-800 text-sm font-bold text-white">
            <span className="text-teal-400">Total Estimated Price:</span>
            <span className="text-teal-300">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={!isValidForm || isSubmitting}
        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold py-5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          "Creating Order..."
        ) : isAvailable ? (
          <>
            <span>Submit Rental Order</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </>
        ) : (
          "Currently Unavailable"
        )}
      </Button>
    </form>
  );
}
