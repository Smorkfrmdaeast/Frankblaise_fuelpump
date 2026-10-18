import React, { useState } from 'react';
import { siteConfig, formatNaira } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { PackageSelection } from './PackagesSection';
import { AlertTriangle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface OrderFormSectionProps {
  selectedPackage: PackageSelection;
  onSelectPackage: (pkg: PackageSelection) => void;
}

export const OrderFormSection: React.FC<OrderFormSectionProps> = ({
  selectedPackage,
  onSelectPackage,
}) => {
  const adminData = useAdminData();

  // Field values
  const [fullName, setFullName] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');

  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [engineType, setEngineType] = useState('');
  const [existingPartNumber, setExistingPartNumber] = useState('');

  const [state, setState] = useState('');
  const [cityTown, setCityTown] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('');

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState(false);

  const currentWhatsApp = adminData.whatsappNumber || siteConfig.whatsappNumber;
  const isEndpointConfigured = Boolean(
    siteConfig.orderEndpointUrl && siteConfig.orderEndpointUrl.trim() !== ''
  );
  const isWhatsAppConfigured = Boolean(
    currentWhatsApp && currentWhatsApp.trim() !== ''
  );

  // Generate vehicle production years from current year down to 1980
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= 1980; y--) {
    years.push(y);
  }

  // All 36 Nigerian States + FCT
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  // Pricing calculations
  const quantity = selectedPackage === 'double' ? 2 : 1;
  const productTotal =
    selectedPackage === 'double'
      ? adminData.doublePrice
      : adminData.singlePrice;
  const finalTotal = productTotal; // No invented delivery fee; delivery charges pending seller confirmation

  // Phone normalization: accepts 0XXXXXXXXXX (11 digits) or +234XXXXXXXXXX
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!primaryPhone.trim()) {
      newErrors.primaryPhone = 'Primary phone number is required.';
    } else {
      const check = validatePhone(primaryPhone);
      if (!check.valid) {
        newErrors.primaryPhone =
          'Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678).';
      }
    }

    if (altPhone.trim()) {
      const check = validatePhone(altPhone);
      if (!check.valid) {
        newErrors.altPhone = 'Please enter a valid phone number or leave blank.';
      }
    }

    if (whatsappPhone.trim()) {
      const check = validatePhone(whatsappPhone);
      if (!check.valid) {
        newErrors.whatsappPhone = 'Please enter a valid WhatsApp number or leave blank.';
      }
    }

    if (!vehicleMake.trim()) {
      newErrors.vehicleMake = 'Vehicle make is required.';
    }

    if (!vehicleModel.trim()) {
      newErrors.vehicleModel = 'Vehicle model is required.';
    }

    if (!vehicleYear.trim()) {
      newErrors.vehicleYear = 'Production year is required.';
    }

    if (!state.trim()) {
      newErrors.state = 'Delivery state is required.';
    }

    if (!cityTown.trim()) {
      newErrors.cityTown = 'City or town is required.';
    }

    if (!fullAddress.trim()) {
      newErrors.fullAddress = 'Full delivery address is required.';
    }

    if (!nearestLandmark.trim()) {
      newErrors.nearestLandmark = 'Nearest bus stop or landmark is required.';
    }

    return newErrors;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const formErrors = validateForm();
    setErrors(formErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Mark all as touched
    const allFields = [
      'fullName', 'primaryPhone', 'vehicleMake', 'vehicleModel',
      'vehicleYear', 'state', 'cityTown', 'fullAddress', 'nearestLandmark'
    ];
    const touchedMap: Record<string, boolean> = {};
    allFields.forEach((f) => { touchedMap[f] = true; });
    setTouched(touchedMap);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Focus first invalid field
      const firstKey = Object.keys(formErrors)[0];
      const element = document.getElementById(`field-${firstKey}`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Check if order endpoint is configured
    if (!isEndpointConfigured) {
      // Prototype mode: submission disabled, no false success
      return;
    }

    setIsSubmitting(true);

    const normalizedPrimary = validatePhone(primaryPhone).normalized;
    const orderPayload = {
      product: siteConfig.productName,
      package: selectedPackage === 'double' ? '2 Fuel Pumps' : '1 Fuel Pump',
      quantity,
      productTotal,
      currency: 'NGN',
      deliveryTerms: 'pending seller confirmation',
      customer: {
        fullName: fullName.trim(),
        primaryPhone: normalizedPrimary,
        altPhone: altPhone.trim() || undefined,
        whatsappNumber: whatsappPhone.trim() || undefined,
      },
      vehicle: {
        make: vehicleMake.trim(),
        model: vehicleModel.trim(),
        productionYear: vehicleYear.trim(),
        engineTypeSize: engineType.trim() || undefined,
        existingPartNumber: existingPartNumber.trim() || undefined,
      },
      delivery: {
        state: state.trim(),
        cityTown: cityTown.trim(),
        fullAddress: fullAddress.trim(),
        nearestLandmark: nearestLandmark.trim(),
      },
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(siteConfig.orderEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        setServerSuccess(true);
        // If WhatsApp ordering is configured, open wa.me
        if (isWhatsAppConfigured) {
          const message = encodeURIComponent(
            `*ORDER SUBMITTED: ${siteConfig.productName}*\nPackage: ${orderPayload.package}\nCustomer: ${fullName}\nPhone: ${normalizedPrimary}\nVehicle: ${vehicleMake} ${vehicleModel} (${vehicleYear})\nState: ${state}, ${cityTown}\nAddress: ${fullAddress}\n(Sent after web order submission)`
          );
          try {
            window.open(`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
          } catch (err) {
            // Ignore window.open errors in sandbox
          }
        }
      } else {
        const errorText = await response.text();
        setServerError(`Submission failed (${response.status}). Please try again or contact the seller directly.`);
      }
    } catch (err: any) {
      setServerError('Network error while submitting order. Please check your connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-16 lg:py-20 bg-[#FFFFFF] text-[#292929] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929] font-display">
            Order Your Fuel Pump
          </h2>
          <p className="text-sm text-[#777777] max-w-xl mx-auto">
            Complete your details so the seller can review your order and help confirm vehicle compatibility.
          </p>
        </div>

        {/* Prototype Warning Banner if Endpoint is not configured */}
        {!isEndpointConfigured && (
          <div className="mb-8 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3.5 text-xs sm:text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">
                Order submission is not yet connected. This is a prototype.
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">
                To enable live order processing, configure <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950">orderEndpointUrl</code> in <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950">src/config/site.ts</code> with your form endpoint (e.g., Formspree, Google Sheets webhook, or backend API). The form will validate inputs but will not submit or falsely report orders.
              </p>
            </div>
          </div>
        )}

        {/* Server Success State (rendered ONLY upon a real 2xx response) */}
        {serverSuccess ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950 font-display">
              Order Received Successfully
            </h3>
            <p className="text-sm text-emerald-900 max-w-md mx-auto">
              Thank you, {fullName}. Your order details have been submitted. The seller will contact you via {primaryPhone} to review vehicle compatibility and arrange delivery.
            </p>
            {isWhatsAppConfigured && (
              <p className="text-xs text-emerald-700">
                A copy of your order details was opened in WhatsApp. Please note that opening WhatsApp does not replace review and confirmation by the seller.
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-8 bg-[#F5F5F7] p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm">
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-red-900">
                <AlertCircle className="w-5 h-5 text-[#E32636] shrink-0" />
                <div className="space-y-1 flex-1">
                  <span>{serverError}</span>
                  <div>
                    <button
                      type="submit"
                      className="text-xs font-bold underline hover:no-underline text-red-800"
                    >
                      Click here to retry submission
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* A. Customer Details */}
            <fieldset className="space-y-4 border-b border-neutral-200 pb-6">
              <legend className="text-sm font-bold uppercase tracking-wider text-[#292929] mb-2 font-display">
                A. Customer Information
              </legend>

              <div>
                <label htmlFor="field-fullName" className="block text-xs font-semibold text-[#292929] mb-1">
                  Full Name <span className="text-[#E32636]">*</span>
                </label>
                <input
                  id="field-fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  aria-invalid={Boolean(touched.fullName && errors.fullName)}
                  aria-describedby={touched.fullName && errors.fullName ? 'error-fullName' : undefined}
                  placeholder="e.g. Chukwuemeka Adebayo"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                    touched.fullName && errors.fullName ? 'border-[#E32636]' : 'border-neutral-300'
                  }`}
                />
                {touched.fullName && errors.fullName && (
                  <p id="error-fullName" className="text-xs text-[#E32636] mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-primaryPhone" className="block text-xs font-semibold text-[#292929] mb-1">
                    Primary Phone Number <span className="text-[#E32636]">*</span>
                  </label>
                  <input
                    id="field-primaryPhone"
                    type="tel"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    onBlur={() => handleBlur('primaryPhone')}
                    aria-invalid={Boolean(touched.primaryPhone && errors.primaryPhone)}
                    aria-describedby={touched.primaryPhone && errors.primaryPhone ? 'error-primaryPhone' : undefined}
                    placeholder="08012345678"
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] font-mono ${
                      touched.primaryPhone && errors.primaryPhone ? 'border-[#E32636]' : 'border-neutral-300'
                    }`}
                  />
                  {touched.primaryPhone && errors.primaryPhone && (
                    <p id="error-primaryPhone" className="text-xs text-[#E32636] mt-1">
                      {errors.primaryPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-altPhone" className="block text-xs font-semibold text-[#292929] mb-1">
                    Alternative Phone <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="field-altPhone"
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    onBlur={() => handleBlur('altPhone')}
                    aria-invalid={Boolean(touched.altPhone && errors.altPhone)}
                    aria-describedby={touched.altPhone && errors.altPhone ? 'error-altPhone' : undefined}
                    placeholder="08198765432"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] font-mono"
                  />
                  {touched.altPhone && errors.altPhone && (
                    <p id="error-altPhone" className="text-xs text-[#E32636] mt-1">
                      {errors.altPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="field-whatsappPhone" className="block text-xs font-semibold text-[#292929] mb-1">
                  WhatsApp Number <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="field-whatsappPhone"
                  type="tel"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  onBlur={() => handleBlur('whatsappPhone')}
                  placeholder="08012345678"
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] font-mono"
                />
              </div>
            </fieldset>

            {/* B. Vehicle Details */}
            <fieldset className="space-y-4 border-b border-neutral-200 pb-6">
              <legend className="text-sm font-bold uppercase tracking-wider text-[#292929] mb-1 font-display">
                B. Vehicle Details
              </legend>
              <p className="text-xs text-[#777777] mb-3">
                Vehicle information helps the seller check whether the replacement fuel pump is suitable for your vehicle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="field-vehicleMake" className="block text-xs font-semibold text-[#292929] mb-1">
                    Vehicle Make <span className="text-[#E32636]">*</span>
                  </label>
                  <input
                    id="field-vehicleMake"
                    type="text"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    onBlur={() => handleBlur('vehicleMake')}
                    aria-invalid={Boolean(touched.vehicleMake && errors.vehicleMake)}
                    aria-describedby={touched.vehicleMake && errors.vehicleMake ? 'error-vehicleMake' : undefined}
                    placeholder="e.g. Toyota"
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                      touched.vehicleMake && errors.vehicleMake ? 'border-[#E32636]' : 'border-neutral-300'
                    }`}
                  />
                  {touched.vehicleMake && errors.vehicleMake && (
                    <p id="error-vehicleMake" className="text-xs text-[#E32636] mt-1">
                      {errors.vehicleMake}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-vehicleModel" className="block text-xs font-semibold text-[#292929] mb-1">
                    Vehicle Model <span className="text-[#E32636]">*</span>
                  </label>
                  <input
                    id="field-vehicleModel"
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    onBlur={() => handleBlur('vehicleModel')}
                    aria-invalid={Boolean(touched.vehicleModel && errors.vehicleModel)}
                    aria-describedby={touched.vehicleModel && errors.vehicleModel ? 'error-vehicleModel' : undefined}
                    placeholder="e.g. Camry"
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                      touched.vehicleModel && errors.vehicleModel ? 'border-[#E32636]' : 'border-neutral-300'
                    }`}
                  />
                  {touched.vehicleModel && errors.vehicleModel && (
                    <p id="error-vehicleModel" className="text-xs text-[#E32636] mt-1">
                      {errors.vehicleModel}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-vehicleYear" className="block text-xs font-semibold text-[#292929] mb-1">
                    Production Year <span className="text-[#E32636]">*</span>
                  </label>
                  <select
                    id="field-vehicleYear"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    onBlur={() => handleBlur('vehicleYear')}
                    aria-invalid={Boolean(touched.vehicleYear && errors.vehicleYear)}
                    aria-describedby={touched.vehicleYear && errors.vehicleYear ? 'error-vehicleYear' : undefined}
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                      touched.vehicleYear && errors.vehicleYear ? 'border-[#E32636]' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Select Year</option>
                    {years.map((y) => (
                      <option key={y} value={y.toString()}>
                        {y}
                      </option>
                    ))}
                  </select>
                  {touched.vehicleYear && errors.vehicleYear && (
                    <p id="error-vehicleYear" className="text-xs text-[#E32636] mt-1">
                      {errors.vehicleYear}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-engineType" className="block text-xs font-semibold text-[#292929] mb-1">
                    Engine Type / Size <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="field-engineType"
                    type="text"
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    placeholder="e.g. 2.4L 4-Cylinder, 3.5L V6"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636]"
                  />
                </div>

                <div>
                  <label htmlFor="field-existingPartNumber" className="block text-xs font-semibold text-[#292929] mb-1">
                    Existing Fuel Pump Part Number <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="field-existingPartNumber"
                    type="text"
                    value={existingPartNumber}
                    onChange={(e) => setExistingPartNumber(e.target.value)}
                    placeholder="e.g. 23221-0D010 or sample markings"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] font-mono"
                  />
                </div>
              </div>
            </fieldset>

            {/* C. Package Selection */}
            <fieldset className="space-y-3 border-b border-neutral-200 pb-6">
              <legend className="text-sm font-bold uppercase tracking-wider text-[#292929] mb-2 font-display">
                C. Package Selection
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  selectedPackage === 'single'
                    ? 'border-[#E32636] bg-white shadow-sm'
                    : 'border-neutral-200 bg-white/60 hover:bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="form-package"
                      value="single"
                      checked={selectedPackage === 'single'}
                      onChange={() => onSelectPackage('single')}
                      className="w-4 h-4 text-[#E32636] accent-[#E32636]"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#292929]">
                      1 Fuel Pump — {formatNaira(adminData.singlePrice)}
                    </span>
                  </div>
                </label>

                <label className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  selectedPackage === 'double'
                    ? 'border-[#E32636] bg-white shadow-sm'
                    : 'border-neutral-200 bg-white/60 hover:bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="form-package"
                      value="double"
                      checked={selectedPackage === 'double'}
                      onChange={() => onSelectPackage('double')}
                      className="w-4 h-4 text-[#E32636] accent-[#E32636]"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#292929]">
                      2 Fuel Pumps — {formatNaira(adminData.doublePrice)}
                    </span>
                  </div>
                </label>
              </div>
            </fieldset>

            {/* D. Delivery Details */}
            <fieldset className="space-y-4 border-b border-neutral-200 pb-6">
              <legend className="text-sm font-bold uppercase tracking-wider text-[#292929] mb-2 font-display">
                D. Delivery Destination in Nigeria
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-state" className="block text-xs font-semibold text-[#292929] mb-1">
                    State <span className="text-[#E32636]">*</span>
                  </label>
                  <select
                    id="field-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    onBlur={() => handleBlur('state')}
                    aria-invalid={Boolean(touched.state && errors.state)}
                    aria-describedby={touched.state && errors.state ? 'error-state' : undefined}
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                      touched.state && errors.state ? 'border-[#E32636]' : 'border-neutral-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    {nigerianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {touched.state && errors.state && (
                    <p id="error-state" className="text-xs text-[#E32636] mt-1">
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-cityTown" className="block text-xs font-semibold text-[#292929] mb-1">
                    City / Town / LGA <span className="text-[#E32636]">*</span>
                  </label>
                  <input
                    id="field-cityTown"
                    type="text"
                    value={cityTown}
                    onChange={(e) => setCityTown(e.target.value)}
                    onBlur={() => handleBlur('cityTown')}
                    aria-invalid={Boolean(touched.cityTown && errors.cityTown)}
                    aria-describedby={touched.cityTown && errors.cityTown ? 'error-cityTown' : undefined}
                    placeholder="e.g. Ikeja, Wuse 2, Port Harcourt GRA"
                    className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                      touched.cityTown && errors.cityTown ? 'border-[#E32636]' : 'border-neutral-300'
                    }`}
                  />
                  {touched.cityTown && errors.cityTown && (
                    <p id="error-cityTown" className="text-xs text-[#E32636] mt-1">
                      {errors.cityTown}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="field-fullAddress" className="block text-xs font-semibold text-[#292929] mb-1">
                  Full Delivery Address <span className="text-[#E32636]">*</span>
                </label>
                <input
                  id="field-fullAddress"
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  onBlur={() => handleBlur('fullAddress')}
                  aria-invalid={Boolean(touched.fullAddress && errors.fullAddress)}
                  aria-describedby={touched.fullAddress && errors.fullAddress ? 'error-fullAddress' : undefined}
                  placeholder="Street name, house/shop number, building description"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                    touched.fullAddress && errors.fullAddress ? 'border-[#E32636]' : 'border-neutral-300'
                  }`}
                />
                {touched.fullAddress && errors.fullAddress && (
                  <p id="error-fullAddress" className="text-xs text-[#E32636] mt-1">
                    {errors.fullAddress}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="field-nearestLandmark" className="block text-xs font-semibold text-[#292929] mb-1">
                  Nearest Bus Stop / Landmark <span className="text-[#E32636]">*</span>
                </label>
                <input
                  id="field-nearestLandmark"
                  type="text"
                  value={nearestLandmark}
                  onChange={(e) => setNearestLandmark(e.target.value)}
                  onBlur={() => handleBlur('nearestLandmark')}
                  aria-invalid={Boolean(touched.nearestLandmark && errors.nearestLandmark)}
                  aria-describedby={touched.nearestLandmark && errors.nearestLandmark ? 'error-nearestLandmark' : undefined}
                  placeholder="e.g. Opposite Total Filling Station, near Central Mosque"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-[#292929] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#E32636] ${
                    touched.nearestLandmark && errors.nearestLandmark ? 'border-[#E32636]' : 'border-neutral-300'
                  }`}
                />
                {touched.nearestLandmark && errors.nearestLandmark && (
                  <p id="error-nearestLandmark" className="text-xs text-[#E32636] mt-1">
                    {errors.nearestLandmark}
                  </p>
                )}
              </div>
            </fieldset>

            {/* E. Order Summary */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 space-y-2.5 text-xs sm:text-sm">
              <div className="font-bold uppercase tracking-wider text-[#292929] pb-2 border-b border-neutral-200 font-display">
                E. Order Summary
              </div>

              <div className="flex justify-between">
                <span className="text-[#777777]">Selected package:</span>
                <span className="font-bold text-[#292929]">
                  {selectedPackage === 'double' ? '2 Fuel Pumps' : '1 Fuel Pump'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#777777]">Quantity:</span>
                <span className="font-bold text-[#292929]">{quantity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#777777]">Product total:</span>
                <span className="font-bold text-[#292929] font-mono tabular-nums">
                  {formatNaira(productTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#777777]">Delivery terms:</span>
                <span className="italic text-[#777777]">
                  pending seller confirmation
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200 text-sm sm:text-base font-bold">
                <span className="text-[#292929]">Final total:</span>
                <span className="text-[#E32636] font-mono tabular-nums text-lg sm:text-xl">
                  {formatNaira(finalTotal)}
                </span>
              </div>
            </div>

            {/* Submission Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !isEndpointConfigured}
                className="min-tap-target w-full py-4 px-6 bg-[#E32636] hover:bg-[#B51222] text-white font-bold text-sm sm:text-base rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <span>SUBMIT YOUR ORDER</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
