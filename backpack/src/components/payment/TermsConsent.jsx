"use client";
import { useState } from "react";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

export default function TermsConsent({ accepted, onChange, bookingChargePerHead = 1500, travelerCount = 1 }) {
  const [expanded, setExpanded] = useState(false);
  const totalCharge = bookingChargePerHead * travelerCount;

  return (
    <div className="glass-card p-5 border border-cream/10 space-y-4">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-left">
        <h3 className="text-cream font-semibold text-sm flex items-center gap-2"><Shield size={16} className="text-burnt-orange" /> Terms, Conditions & Cancellation Policy</h3>
        {expanded ? <ChevronUp size={16} className="text-cream/40" /> : <ChevronDown size={16} className="text-cream/40" />}
      </button>

      {expanded && (
        <div className="space-y-3 text-cream/50 text-xs leading-relaxed border-t border-cream/5 pt-4">
          <div>
            <p className="text-cream/70 font-semibold mb-1">Cancellation & Refund Policy</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>₹{bookingChargePerHead.toLocaleString("en-IN")} per head booking charge is <span className="text-red-400 font-medium">non-refundable</span> under any circumstances.</li>
              <li>Cancellation before 15 days of departure: remaining amount refunded within 7-10 working days.</li>
              <li>Cancellation within 7-15 days: 50% of remaining amount refunded.</li>
              <li>Cancellation within 7 days of departure: no refund.</li>
              <li>No-show on departure date: no refund applicable.</li>
            </ul>
          </div>
          <div>
            <p className="text-cream/70 font-semibold mb-1">Booking Terms</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>All travelers must carry a valid government-issued photo ID.</li>
              <li>BackPack Junction reserves the right to modify itinerary due to weather/safety.</li>
              <li>Travelers are responsible for their personal belongings and health fitness.</li>
              <li>Any damage to property/equipment will be charged to the traveler.</li>
              <li>Consumption of alcohol/drugs during treks is strictly prohibited.</li>
              <li>BackPack Junction is not liable for delays caused by natural calamities or force majeure.</li>
            </ul>
          </div>
          <div>
            <p className="text-cream/70 font-semibold mb-1">Payment Terms</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Full payment must be completed 7 days before departure.</li>
              <li>Pay Later option requires ₹{bookingChargePerHead.toLocaleString("en-IN")}/head (total ₹{totalCharge.toLocaleString("en-IN")}) as booking confirmation.</li>
              <li>Balance amount must be paid before the trip start date.</li>
              <li>All prices are in INR and inclusive of applicable taxes unless stated otherwise.</li>
            </ul>
          </div>
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer group">
        <input type="checkbox" checked={accepted} onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-cream/20 bg-transparent accent-burnt-orange cursor-pointer" />
        <span className="text-cream/60 text-xs leading-relaxed group-hover:text-cream/80 transition-colors">
          I agree to the <button type="button" onClick={() => setExpanded(true)} className="text-burnt-orange underline underline-offset-2">Terms & Conditions</button>.
        </span>
      </label>
    </div>
  );
}
