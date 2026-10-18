import React from 'react';
import { ShieldCheck, Truck, Banknote, Phone, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center font-black text-white text-xs">
                FB
              </div>
              <span className="font-extrabold tracking-wider text-base text-white uppercase font-display">
                FRANKBLAISE <span className="text-red-500">PARTS</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Premium automotive components and electric fuel pumps engineered for durability, sustained fuel rail pressure, and peace of mind on Nigerian highways.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#benefits" className="hover:text-white transition-colors">Engineered Benefits</a></li>
              <li><a href="#compatibility" className="hover:text-white transition-colors">Vehicle Compatibility</a></li>
              <li><a href="#specs" className="hover:text-white transition-colors">Cutaway Diagram &amp; Specs</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">WhatsApp Customer Reviews</a></li>
              <li><a href="#warranty" className="hover:text-white transition-colors">1-Year Warranty Terms</a></li>
              <li><a href="#order-form" className="hover:text-white transition-colors">Pay On Delivery Order Form</a></li>
            </ul>
          </div>

          {/* Logistics & Delivery */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Nationwide Logistics</h4>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Express dispatch across all 36 Nigerian States &amp; Abuja FCT.</span>
              </div>
              <div className="flex items-start gap-2">
                <Banknote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pay on delivery: Cash or mobile bank transfer upon inspection.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>365-day full replacement warranty included.</span>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Customer Desk</h4>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Monday – Saturday: 8:00 AM – 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Dispatch: Active 24/7 for Order Intake</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} FRANKBLAISE PARTS. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Genuine Auto Parts</span>
            <span aria-hidden="true">·</span>
            <span>Pay On Delivery Terms Apply</span>
            <span aria-hidden="true">·</span>
            <span>1-Year Direct Swap Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
