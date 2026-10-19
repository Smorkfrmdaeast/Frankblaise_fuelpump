import React, { useState } from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { formatNaira } from '../config/site';
import {
  isFirebaseConfigured,
  submitOrderToBackend,
} from '../services/firebase';
import { PackageSelection } from './PackagesSection';
import { NIGERIAN_STATES } from '../data/nigeriaStates';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

interface OrderFormSectionProps {
  selectedPackage: PackageSelection;
  onSelectPackage: (pkg: PackageSelection) => void;
}

export const OrderFormSection: React.FC<OrderFormSectionProps> = ({
  selectedPackage,
  onSelectPackage,
}) => {
  const config = useProductConfig();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');

  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [existingPartNumber, setExistingPartNumber] = useState('');

  const [selectedState, setSelectedState] = useState('');
  const [cityTown, setCityTown] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('');

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrderRef, setConfirmedOrderRef] = useState<string | null>(null);

  // Vehicle years: current year down to 1980
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= 1980; y--) {
    years.push(y);
  }

  // Authoritative price calculation
  const unitPrice =
    selectedPackage === 'double'
      ? config.prices.doublePump
      : config.prices.singlePump;
  const quantity = selectedPackage === 'double' ? 2 : 1;
  const totalAmount = unitPrice;

  // Phone Normalization and validation
  const validatePhone = (phoneStr: string): { valid: boolean; normalized: string } => {
    const cleaned = phoneStr.trim().replace(/[\s-]/g, '');
    if (/^0[789][01]\d{8}$/.test(cleaned)) {
      return { valid: true, normalized: `+234${cleaned.substring(1)}` };
    }
    if (/^\+234[789][01]\d{8}$/.test(cleaned)) {
      return { valid: true, normalized: cleaned };
    }
    if (/^234[789][01]\d{8}$/.test(cleaned)) {
      return { valid: true, normalized: `+${cleaned}` };
    }
    return { valid: false, normalized: cleaned };
  };

  const validateAll = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full legal or contact name is required.';
    }

    if (!primaryPhone.trim()) {
      errs.primaryPhone = 'Primary phone number is required.';
    } else {
      const check = validatePhone(primaryPhone);
      if (!check.valid) {
        errs.primaryPhone =
          'Please enter a valid Nigerian mobile number (e.g. 08012345678 or +2348012345678).';
      }
    }

    if (altPhone.trim()) {
      const check = validatePhone(altPhone);
      if (!check.valid) {
        errs.altPhone = 'Please enter a valid alternative phone or leave empty.';
      }
    }

    if (whatsappPhone.trim()) {
      const check = validatePhone(whatsappPhone);
      if (!check.valid) {
        errs.whatsappPhone = 'Please enter a valid WhatsApp number or leave empty.';
      }
    }

    if (!vehicleMake.trim()) {
      errs.vehicleMake = 'Vehicle make is required (e.g. Toyota, Honda, Nissan).';
    }

    if (!vehicleModel.trim()) {
      errs.vehicleModel = 'Vehicle model is required (e.g. Corolla, Civic, Almera).';
    }

    if (!vehicleYear.trim()) {
      errs.vehicleYear = 'Production year is required.';
    }

    if (!selectedState.trim()) {
      errs.state = 'Delivery state is required.';
    }

    if (!cityTown.trim()) {
      errs.cityTown = 'City or LGA locality is required.';
    }

    if (!fullAddress.trim()) {
      errs.fullAddress = 'Detailed street delivery address is required.';
    }

    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrs = validateAll();
    setErrors(currentErrs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark required fields touched
    const requiredFields = [
      'fullName',
      'primaryPhone',
      'vehicleMake',
      'vehicleModel',
      'vehicleYear',
      'state',
      'cityTown',
      'fullAddress',
    ];
    const touchedAll: Record<string, boolean> = {};
    requiredFields.forEach((f) => (touchedAll[f] = true));
    setTouched(touchedAll);

    const formErrors = validateAll();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      const firstField = Object.keys(formErrors)[0];
      const element = document.getElementById(`field-${firstField}`);
      element?.focus();
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    const normalizedPrimary = validatePhone(primaryPhone).normalized;

    const result = await submitOrderToBackend({
      packageKey: selectedPackage,
      customer: {
        fullName: fullName.trim(),
        primaryPhone: normalizedPrimary,
        altPhone: altPhone.trim() || undefined,
        whatsappPhone: whatsappPhone.trim() || undefined,
      },
      vehicle: {
        make: vehicleMake.trim(),
        model: vehicleModel.trim(),
        productionYear: vehicleYear.trim(),
        engineSize: engineSize.trim() || undefined,
        existingPartNumber: existingPartNumber.trim() || undefined,
      },
      delivery: {
        state: selectedState.trim(),
        cityTown: cityTown.trim(),
        fullAddress: fullAddress.trim(),
        nearestLandmark: nearestLandmark.trim() || undefined,
      },
    });

    setIsSubmitting(false);

    if (result.success && result.orderReference) {
      setConfirmedOrderRef(result.orderReference);
      // The user is presented with the clear, direct 'Send Copy to WhatsApp' button on the confirmation card
    } else {
      setSubmitError(result.error || 'Failed to submit order. Please retry.');
    }
  };

  // WhatsApp order text generator
  const generateWhatsAppOrderUrl = () => {
    const rawNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
    const packageName = selectedPackage === 'double' ? '2 Fuel Pumps' : '1 Fuel Pump';
    const header = confirmedOrderRef
      ? `*NEW ORDER SUBMITTED: ${confirmedOrderRef}*`
      : `*FRANKBLAISE DIRECT ORDER REQUEST*`;
    const text = `${header}\nPackage: ${packageName} (${formatNaira(totalAmount)})\nCustomer: ${fullName || '(Pending name)'}\nPhone: ${primaryPhone || '(Pending phone)'}\nVehicle: ${vehicleMake || 'Make'} ${vehicleModel || 'Model'} (${vehicleYear || 'Year'})\nEngine: ${engineSize || 'N/A'}\nState: ${selectedState || 'N/A'}\nCity: ${cityTown || 'N/A'}\nAddress: ${fullAddress || 'N/A'}\n\n*Notice: Confirmation by telephone call is required before parcel dispatch.*`;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="order-form" className="bg-[#F6F4EF] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 10 · ORDER TERMINAL
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Vehicle Verification &amp; Order Form
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31]">
            Please submit your vehicle and delivery details. Our automotive technician will phone you to confirm mechanical fitment before parcel dispatch.
          </p>
        </div>

        {/* Reassuring Order Trust Strip */}
        <div className="p-4 bg-[#E9E7E2] border border-[#D5D2CB] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-[#2B2D31]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B51222] shrink-0" />
            <span>PAY ON DELIVERY · NATIONWIDE COURIER · COMPATIBILITY CHECK</span>
          </div>
          <a
            href={generateWhatsAppOrderUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B51222] hover:underline font-bold inline-flex items-center gap-1 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Prefer WhatsApp? Order Directly</span>
          </a>
        </div>

        {/* Success State — Shown ONLY upon genuine confirmed backend save */}
        {confirmedOrderRef ? (
          <div className="bg-white border-2 border-emerald-500 rounded-2xl p-8 sm:p-10 space-y-6 text-center shadow-md">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest block">
                ORDER RECORDED SUCCESSFULLY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase font-display text-[#1B1C1F]">
                Reference: {confirmedOrderRef}
              </h3>
              <p className="text-sm text-[#2B2D31] max-w-lg mx-auto">
                Thank you, {fullName}. Your order for the{' '}
                <strong>
                  {selectedPackage === 'double' ? '2 Fuel Pumps' : '1 Fuel Pump'}
                </strong>{' '}
                package has been logged into the seller dispatch queue.
              </p>
            </div>

            <div className="p-4 bg-[#F6F4EF] border border-[#D5D2CB] rounded-xl max-w-md mx-auto text-left text-xs font-mono space-y-1.5 text-[#2B2D31]">
              <div className="flex justify-between">
                <span className="text-[#6E7075]">Order Total:</span>
                <span className="font-bold">{formatNaira(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7075]">Vehicle:</span>
                <span>
                  {vehicleMake} {vehicleModel} ({vehicleYear})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7075]">Destination:</span>
                <span>
                  {selectedState}, {cityTown}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7075]">Settlement:</span>
                <span className="text-[#B51222] font-bold">Pay on Delivery</span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <p className="text-xs text-[#6E7075]">
                A seller technician will telephone {primaryPhone} shortly to confirm part fitment.
              </p>
              <a
                href={generateWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="min-tap-target inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Copy to WhatsApp for Faster Processing</span>
              </a>
            </div>
          </div>
        ) : (
          /* Actual Order Form */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white border border-[#D5D2CB] rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm"
          >
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-red-900">
                <AlertCircle className="w-5 h-5 text-[#B51222] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Submission Notice:</span>
                  <p>{submitError}</p>
                </div>
              </div>
            )}

            {/* Fieldset A: Package Selection */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                A. CHOOSE YOUR PACKAGE <span className="text-[#B51222]">*</span>
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedPackage === 'single'
                      ? 'border-[#B51222] bg-[#F6F4EF]'
                      : 'border-[#D5D2CB] hover:border-[#6E7075]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="form-package"
                      value="single"
                      checked={selectedPackage === 'single'}
                      onChange={() => onSelectPackage('single')}
                      className="w-4 h-4 accent-[#B51222]"
                    />
                    <div>
                      <span className="text-xs font-bold font-mono block text-[#1B1C1F]">
                        ONE FUEL PUMP
                      </span>
                      <span className="text-xs text-[#6E7075]">12V Unit + Hardware</span>
                    </div>
                  </div>
                  <span className="text-base font-bold font-mono text-[#1B1C1F]">
                    {formatNaira(config.prices.singlePump)}
                  </span>
                </label>

                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedPackage === 'double'
                      ? 'border-[#B51222] bg-[#F6F4EF]'
                      : 'border-[#D5D2CB] hover:border-[#6E7075]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="form-package"
                      value="double"
                      checked={selectedPackage === 'double'}
                      onChange={() => onSelectPackage('double')}
                      className="w-4 h-4 accent-[#B51222]"
                    />
                    <div>
                      <span className="text-xs font-bold font-mono block text-[#B51222]">
                        TWO FUEL PUMPS
                      </span>
                      <span className="text-xs text-[#6E7075]">Dual Pack + 2 Kits</span>
                    </div>
                  </div>
                  <span className="text-base font-bold font-mono text-[#B51222]">
                    {formatNaira(config.prices.doublePump)}
                  </span>
                </label>
              </div>
            </fieldset>

            {/* Fieldset B: Customer Contact Data */}
            <fieldset className="space-y-4 pt-4 border-t border-[#E9E7E2]">
              <legend className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                B. CUSTOMER CONTACT DATA
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="field-fullName" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Full Name <span className="text-[#B51222]">*</span>
                  </label>
                  <input
                    id="field-fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    aria-invalid={Boolean(touched.fullName && errors.fullName)}
                    aria-describedby={touched.fullName && errors.fullName ? 'err-fullName' : undefined}
                    placeholder="e.g. Chukwuemeka Adeleke"
                    className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                      touched.fullName && errors.fullName ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p id="err-fullName" className="text-xs text-[#B51222] mt-1 font-mono">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-primaryPhone" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Primary Phone Number <span className="text-[#B51222]">*</span>
                  </label>
                  <input
                    id="field-primaryPhone"
                    type="tel"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    onBlur={() => handleBlur('primaryPhone')}
                    aria-invalid={Boolean(touched.primaryPhone && errors.primaryPhone)}
                    aria-describedby={touched.primaryPhone && errors.primaryPhone ? 'err-primaryPhone' : undefined}
                    placeholder="08012345678 or +234..."
                    className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                      touched.primaryPhone && errors.primaryPhone ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                    }`}
                  />
                  {touched.primaryPhone && errors.primaryPhone && (
                    <p id="err-primaryPhone" className="text-xs text-[#B51222] mt-1 font-mono">
                      {errors.primaryPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-altPhone" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Alternative Phone (Optional)
                  </label>
                  <input
                    id="field-altPhone"
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    onBlur={() => handleBlur('altPhone')}
                    aria-invalid={Boolean(touched.altPhone && errors.altPhone)}
                    aria-describedby={touched.altPhone && errors.altPhone ? 'err-altPhone' : undefined}
                    placeholder="Second phone number if reachable"
                    className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                  {touched.altPhone && errors.altPhone && (
                    <p id="err-altPhone" className="text-xs text-[#B51222] mt-1 font-mono">
                      {errors.altPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-whatsappPhone" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    id="field-whatsappPhone"
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    onBlur={() => handleBlur('whatsappPhone')}
                    placeholder="If different from primary phone"
                    className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Fieldset C: Vehicle Compatibility Data */}
            <fieldset className="space-y-4 pt-4 border-t border-[#E9E7E2]">
              <legend className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                C. VEHICLE COMPATIBILITY DATA
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="field-vehicleMake" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Vehicle Make <span className="text-[#B51222]">*</span>
                  </label>
                  <input
                    id="field-vehicleMake"
                    type="text"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    onBlur={() => handleBlur('vehicleMake')}
                    aria-invalid={Boolean(touched.vehicleMake && errors.vehicleMake)}
                    placeholder="e.g. Toyota"
                    className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                      touched.vehicleMake && errors.vehicleMake ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                    }`}
                  />
                  {touched.vehicleMake && errors.vehicleMake && (
                    <p className="text-xs text-[#B51222] mt-1 font-mono">{errors.vehicleMake}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-vehicleModel" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Vehicle Model <span className="text-[#B51222]">*</span>
                  </label>
                  <input
                    id="field-vehicleModel"
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    onBlur={() => handleBlur('vehicleModel')}
                    aria-invalid={Boolean(touched.vehicleModel && errors.vehicleModel)}
                    placeholder="e.g. Corolla / Camry"
                    className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                      touched.vehicleModel && errors.vehicleModel ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                    }`}
                  />
                  {touched.vehicleModel && errors.vehicleModel && (
                    <p className="text-xs text-[#B51222] mt-1 font-mono">{errors.vehicleModel}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-vehicleYear" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Year (1980–{currentYear}) <span className="text-[#B51222]">*</span>
                  </label>
                  <select
                    id="field-vehicleYear"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    onBlur={() => handleBlur('vehicleYear')}
                    aria-invalid={Boolean(touched.vehicleYear && errors.vehicleYear)}
                    className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                      touched.vehicleYear && errors.vehicleYear ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                    }`}
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  {touched.vehicleYear && errors.vehicleYear && (
                    <p className="text-xs text-[#B51222] mt-1 font-mono">{errors.vehicleYear}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label htmlFor="field-engineSize" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Engine Size / Code (Optional)
                  </label>
                  <input
                    id="field-engineSize"
                    type="text"
                    value={engineSize}
                    onChange={(e) => setEngineSize(e.target.value)}
                    placeholder="e.g. 1.8L 4-Cyl or 2.4L V6"
                    className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>

                <div>
                  <label htmlFor="field-partNumber" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    Existing Pump OEM Part # (Optional)
                  </label>
                  <input
                    id="field-partNumber"
                    type="text"
                    value={existingPartNumber}
                    onChange={(e) => setExistingPartNumber(e.target.value)}
                    placeholder="e.g. 23220-0C050"
                    className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Fieldset D: Delivery Destination */}
            <fieldset className="space-y-4 pt-4 border-t border-[#E9E7E2]">
              <legend className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                D. NIGERIAN DELIVERY ADDRESS
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="field-state" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    State (36 States + FCT) <span className="text-[#B51222]">*</span>
                  </label>
                  <select
                    id="field-state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    onBlur={() => handleBlur('state')}
                    aria-invalid={Boolean(touched.state && errors.state)}
                    className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                      touched.state && errors.state ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                    }`}
                  >
                    <option value="">Select Delivery State</option>
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st.name} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                  {touched.state && errors.state && (
                    <p className="text-xs text-[#B51222] mt-1 font-mono">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-cityTown" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                    City / Town / LGA <span className="text-[#B51222]">*</span>
                  </label>
                  <input
                    id="field-cityTown"
                    type="text"
                    value={cityTown}
                    onChange={(e) => setCityTown(e.target.value)}
                    onBlur={() => handleBlur('cityTown')}
                    aria-invalid={Boolean(touched.cityTown && errors.cityTown)}
                    placeholder="e.g. Ikeja, GRA, Wuse 2"
                    className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                      touched.cityTown && errors.cityTown ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                    }`}
                  />
                  {touched.cityTown && errors.cityTown && (
                    <p className="text-xs text-[#B51222] mt-1 font-mono">{errors.cityTown}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="field-fullAddress" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                  Full Street Address <span className="text-[#B51222]">*</span>
                </label>
                <input
                  id="field-fullAddress"
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  onBlur={() => handleBlur('fullAddress')}
                  aria-invalid={Boolean(touched.fullAddress && errors.fullAddress)}
                  placeholder="Street name, house/workshop number, area description"
                  className={`w-full px-4 py-3 bg-[#F6F4EF] border rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222] ${
                    touched.fullAddress && errors.fullAddress ? 'border-[#B51222]' : 'border-[#D5D2CB]'
                  }`}
                />
                {touched.fullAddress && errors.fullAddress && (
                  <p className="text-xs text-[#B51222] mt-1 font-mono">{errors.fullAddress}</p>
                )}
              </div>

              <div>
                <label htmlFor="field-landmark" className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] mb-1.5 font-mono">
                  Nearest Landmark / Bus Stop (Optional)
                </label>
                <input
                  id="field-landmark"
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  placeholder="e.g. Opposite Total Energies, near central market gate"
                  className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>
            </fieldset>

            {/* Recalculated Order Summary Strip */}
            <div className="p-5 bg-[#E9E7E2] border border-[#D5D2CB] rounded-xl space-y-2 text-xs font-mono text-[#2B2D31]">
              <div className="flex justify-between items-center text-sm font-bold border-b border-[#D5D2CB] pb-2">
                <span className="uppercase text-[#1B1C1F]">Recalculated Total (NGN)</span>
                <span className="text-xl text-[#B51222] tabular-nums font-mono">
                  {formatNaira(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{quantity} Unit{quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>Pay on Delivery</span>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !isFirebaseConfigured}
                className="min-tap-target w-full py-4 px-6 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-sm sm:text-base uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>RECORDING ORDER ON SERVER...</span>
                  </>
                ) : !isFirebaseConfigured ? (
                  <span>ORDER FORM READY — CONNECT CLOUD BACKEND TO SUBMIT</span>
                ) : (
                  <span>SUBMIT ORDER FOR COMPATIBILITY REVIEW</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
