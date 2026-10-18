import React from 'react';
import { CheckCircle2, Printer, X, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { PackageType } from './PackagePricingSelector';

export interface ConfirmedOrderDetails {
  orderId: string;
  fullName: string;
  phone: string;
  altPhone?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  packageType: PackageType;
  totalAmount: number;
  state: string;
  city: string;
  deliveryAddress: string;
  timestamp: string;
  whatsappUrl: string;
}

interface OrderConfirmationModalProps {
  order: ConfirmedOrderDetails | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white text-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center font-black shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-red-100 block">
                ORDER RECORDED SUCCESSFULLY
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display">
                Order #{order.orderId}
              </h3>
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
            <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <strong className="block font-bold mb-0.5">Pay On Delivery Terms Activated</strong>
              Your order has been queued for verification and packaging. You will pay <strong>₦{order.totalAmount.toLocaleString()}</strong> in cash or instant transfer only after receiving and inspecting your package.
            </div>
          </div>

          {/* Itemized Order Breakdown */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3 text-xs">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="font-semibold text-neutral-500">Selected Package:</span>
              <span className="font-bold text-neutral-900">
                {order.packageType === 'double'
                  ? 'Double Value Pack (2x Electric Fuel Pumps)'
                  : 'Single Fuel Pump Pack (1x Electric Fuel Pump)'}
              </span>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="font-semibold text-neutral-500">Vehicle Fitment:</span>
              <span className="font-bold text-neutral-900 font-mono">
                {order.vehicleMake} {order.vehicleModel} ({order.vehicleYear})
              </span>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="font-semibold text-neutral-500">Customer Name:</span>
              <span className="font-bold text-neutral-900">{order.fullName}</span>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="font-semibold text-neutral-500">Contact Phone:</span>
              <span className="font-bold text-neutral-900 font-mono">{order.phone}</span>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="font-semibold text-neutral-500">Delivery Destination:</span>
              <span className="font-bold text-neutral-900 text-right max-w-xs">
                {order.deliveryAddress}, {order.city}, {order.state} State
              </span>
            </div>

            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="font-semibold text-neutral-500">Warranty Coverage:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 1-Year Direct Replacement
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="font-bold text-sm text-neutral-900">Total Payable on Delivery:</span>
              <span className="font-mono font-black text-xl text-red-600">
                ₦{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={order.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Connect With Dispatch On WhatsApp</span>
            </a>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-xl border border-neutral-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Order Slip</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Done / Return to Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
