import React, { useState, useEffect } from 'react';
import { PackageType } from './PackagePricingSelector';
import { NIGERIAN_STATES } from '../data/nigeriaStates';
import { ConfirmedOrderDetails } from './OrderConfirmationModal';
import { Truck, ShieldCheck, Banknote, AlertCircle, CheckCircle2, Car, MapPin, Phone, User } from 'lucide-react';

interface OrderFormProps {
  selectedPackage: PackageType;
  onSelectPackage: (pkg: PackageType) => void;
  prefilledVehicle?: { make: string; model: string };
  onOrderSuccess: (order: ConfirmedOrderDetails) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  selectedPackage,
  onSelectPackage,
  prefilledVehicle,
  onOrderSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply prefilled vehicle if user clicked a vehicle in compatibility checker
  useEffect(() => {
    if (prefilledVehicle?.make) {
      setVehicleMake(prefilledVehicle.make);
      if (prefilledVehicle.model && prefilledVehicle.model !== 'Custom') {
        setVehicleModel(prefilledVehicle.model);
      }
    }
  }, [prefilledVehicle]);

  // Set default city when state changes
  useEffect(() => {
    const foundState = NIGERIAN_STATES.find((s) => s.name === state);
    if (foundState && foundState.majorCities.length > 0) {
      setCity(foundState.majorCities[0]);
    }
  }, [state]);

  const packagePrice = selectedPackage === 'double' ? 45000 : 25000;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full name (minimum 3 characters)';
    }

    const cleanedPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^(0[789][01]\d{8}|\+?234[789][01]\d{8})$/;
    if (!cleanedPhone) {
      errs.phone = 'Phone number is required for delivery coordination';
    } else if (!phoneRegex.test(cleanedPhone) && cleanedPhone.length < 10) {
      errs.phone = 'Please enter a valid Nigerian phone number (e.g. 08031234567)';
    }

    if (!vehicleMake.trim()) {
      errs.vehicleMake = 'Please provide vehicle make (e.g. Toyota, Honda, Lexus)';
    }

    if (!vehicleModel.trim()) {
      errs.vehicleModel = 'Please provide vehicle model (e.g. Camry, Accord, Corolla)';
    }

    const yearNum = parseInt(vehicleYear.trim(), 10);
    const currentYear = new Date().getFullYear();
    if (!vehicleYear.trim() || isNaN(yearNum) || yearNum < 1980 || yearNum > currentYear + 1) {
      errs.vehicleYear = `Please enter a valid 4-digit vehicle year (1980 - ${currentYear})`;
    }

    if (!state.trim()) {
      errs.state = 'Please select your delivery state';
    }

    if (!city.trim()) {
      errs.city = 'Please specify your city or LGA';
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      errs.deliveryAddress = 'Please enter complete street delivery address (minimum 8 characters)';
    }

    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      phone: true,
      vehicleMake: true,
      vehicleModel: true,
      vehicleYear: true,
      state: true,
      city: true,
      deliveryAddress: true,
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(`input-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Generate verified order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `FB-ORD-${randomSuffix}`;

    const formattedMessage = `*NEW ORDER: FRANKBLAISE ELECTRIC FUEL PUMP PLUS*
---------------------------------------
*Order ID:* ${orderId}
*Package Selected:* ${selectedPackage === 'double' ? 'Double Value Pack (2 Pumps) - ₦45,000' : 'Single Fuel Pump Pack (1 Pump) - ₦25,000'}
*Total Amount Payable:* ₦${packagePrice.toLocaleString()} (FREE DELIVERY)
*Payment Method:* PAY ON DELIVERY (Cash / Transfer)
---------------------------------------
*Customer Details:*
- Name: ${fullName.trim()}
- Phone: ${phone.trim()}
${altPhone.trim() ? `- Alt Phone: ${altPhone.trim()}` : ''}
---------------------------------------
*Vehicle Information:*
- Make & Model: ${vehicleMake.trim()} ${vehicleModel.trim()}
- Year: ${vehicleYear.trim()}
---------------------------------------
*Delivery Address:*
- Address: ${deliveryAddress.trim()}
- City/LGA: ${city.trim()}
- State: ${state} State
${deliveryNotes.trim() ? `- Delivery Note: ${deliveryNotes.trim()}` : ''}
---------------------------------------
*Warranty:* 1-Year Direct Replacement Confirmed
Please verify my order and dispatch today. Thank you!`;

    // WhatsApp dispatch URL (uses universal international dispatch desk number)
    const whatsappUrl = `https://wa.me/2348000000000?text=${encodeURIComponent(formattedMessage)}`;

    const confirmedDetails: ConfirmedOrderDetails = {
      orderId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      vehicleMake: vehicleMake.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleYear: vehicleYear.trim(),
      packageType: selectedPackage,
      totalAmount: packagePrice,
      state,
      city: city.trim(),
      deliveryAddress: deliveryAddress.trim(),
      timestamp: new Date().toLocaleString(),
      whatsappUrl,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(confirmedDetails);
      // Try to open WhatsApp dispatch window if possible
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        // window.open blocked by sandbox, modal will provide direct link
      }
    }, 400);
  };

  const selectedStateObj = NIGERIAN_STATES.find((s) => s.name === state);

  return (
    <section id="order-form" className="py-16 lg:py-24 bg-neutral-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-500">
            <Truck className="w-4 h-4" />
            <span>NATIONWIDE DELIVERY DISPATCH</span>
            <span aria-hidden="true">·</span>
            <span>ZERO PAYMENT RISK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Place Your Order (Pay On Delivery)
          </h2>
          <p className="text-base text-neutral-300">
            Fill the verified dispatch form below. Our customer desk will confirm your package and dispatch via our express courier. You only pay after you receive and inspect your pump!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-8 bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Step 1: Package Confirmation Bar inside form */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                  1. Confirm Selected Package:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectPackage('single')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedPackage === 'single'
                        ? 'bg-neutral-800 border-red-500 text-white shadow-md'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block">1 Fuel Pump Pack</span>
                      <span className="text-xs text-neutral-400 font-mono">₦25,000 Delivered</span>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPackage === 'single' ? 'border-red-500 bg-red-600' : 'border-neutral-700'
                    }`}>
                      {selectedPackage === 'single' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectPackage('double')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedPackage === 'double'
                        ? 'bg-neutral-800 border-red-500 text-white shadow-md'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block text-amber-300">2 Pumps (Save ₦5,000)</span>
                      <span className="text-xs text-neutral-400 font-mono">₦45,000 Delivered</span>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPackage === 'double' ? 'border-red-500 bg-red-600' : 'border-neutral-700'
                    }`}>
                      {selectedPackage === 'double' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 2: Contact Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-1">
                  <User className="w-3.5 h-3.5 text-red-500" />
                  <span>2. Customer Contact Details</span>
                </div>

                <div>
                  <label htmlFor="input-fullName" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Babatunde Olawale"
                    className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm transition-all ${
                      touched.fullName && errors.fullName ? 'border-red-500' : 'border-neutral-800'
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="input-phone" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Phone Number (WhatsApp Active) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="e.g. 0803 123 4567"
                      className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm font-mono transition-all ${
                        touched.phone && errors.phone ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="input-altPhone" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Alternative Phone Number <span className="text-neutral-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="input-altPhone"
                      type="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="e.g. 0812 987 6543"
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm font-mono transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Vehicle Fitment Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-1">
                  <Car className="w-3.5 h-3.5 text-red-500" />
                  <span>3. Vehicle Specifications (For Exact Fitment Verification)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="input-vehicleMake" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Vehicle Make <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-vehicleMake"
                      type="text"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      onBlur={() => handleBlur('vehicleMake')}
                      placeholder="e.g. Toyota"
                      className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm transition-all ${
                        touched.vehicleMake && errors.vehicleMake ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {touched.vehicleMake && errors.vehicleMake && (
                      <p className="mt-1 text-xs text-red-400">{errors.vehicleMake}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="input-vehicleModel" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Vehicle Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-vehicleModel"
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      onBlur={() => handleBlur('vehicleModel')}
                      placeholder="e.g. Camry (Muscle)"
                      className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm transition-all ${
                        touched.vehicleModel && errors.vehicleModel ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {touched.vehicleModel && errors.vehicleModel && (
                      <p className="mt-1 text-xs text-red-400">{errors.vehicleModel}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="input-vehicleYear" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Vehicle Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-vehicleYear"
                      type="text"
                      maxLength={4}
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      onBlur={() => handleBlur('vehicleYear')}
                      placeholder="e.g. 2008"
                      className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm font-mono transition-all ${
                        touched.vehicleYear && errors.vehicleYear ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {touched.vehicleYear && errors.vehicleYear && (
                      <p className="mt-1 text-xs text-red-400">{errors.vehicleYear}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 4: Delivery Location */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>4. Delivery Destination in Nigeria</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="input-state" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Delivery State <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="input-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-600 text-sm cursor-pointer"
                    >
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name} State
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="input-city" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      City / Area / LGA <span className="text-red-500">*</span>
                    </label>
                    {selectedStateObj && selectedStateObj.majorCities.length > 0 ? (
                      <div className="space-y-1.5">
                        <select
                          id="input-city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-600 text-sm cursor-pointer"
                        >
                          {selectedStateObj.majorCities.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <input
                        id="input-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => handleBlur('city')}
                        placeholder="e.g. Ikeja, GRA, Wuse 2"
                        className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm ${
                          touched.city && errors.city ? 'border-red-500' : 'border-neutral-800'
                        }`}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="input-deliveryAddress" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Detailed Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-deliveryAddress"
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    onBlur={() => handleBlur('deliveryAddress')}
                    placeholder="e.g. No 15 Awolowo Road, beside Total Filling Station, Ikeja"
                    className={`w-full px-4 py-3 bg-neutral-950 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm transition-all ${
                      touched.deliveryAddress && errors.deliveryAddress ? 'border-red-500' : 'border-neutral-800'
                    }`}
                  />
                  {touched.deliveryAddress && errors.deliveryAddress && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.deliveryAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="input-deliveryNotes" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Delivery Instructions / Special Notes <span className="text-neutral-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="input-deliveryNotes"
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Call my number 30 mins before arrival, deliver to my workshop"
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-red-950/80 hover:shadow-red-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order Dispatch...</span>
                  ) : (
                    <>
                      <span>CONFIRM ORDER (PAY ON DELIVERY)</span>
                      <Truck className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-neutral-400 mt-2.5">
                  🔒 Zero risk · Inspect the package with courier before handing over payment
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary & Trust Guarantee Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 shadow-xl space-y-6">
              <h3 className="font-bold text-base text-white border-b border-neutral-800 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-neutral-400 font-mono">100% Guaranteed</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Selected Item:</span>
                  <span className="font-semibold text-white text-right">
                    {selectedPackage === 'double' ? '2x Fuel Pumps Plus' : '1x Fuel Pump Plus'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Installation Hardware:</span>
                  <span className="font-semibold text-emerald-400">Included FREE</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Nationwide Delivery:</span>
                  <span className="font-semibold text-emerald-400 font-mono">₦0 (FREE)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-400">Replacement Warranty:</span>
                  <span className="font-semibold text-amber-400">1 Full Year</span>
                </div>

                <div className="border-t border-neutral-800 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Amount Due:</span>
                  <span className="text-2xl font-black text-red-500 font-mono tabular-nums">
                    ₦{packagePrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 space-y-2.5 text-xs text-neutral-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Banknote className="w-4 h-4" />
                  <span>How Pay On Delivery Works:</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Our dispatch logistics partner will deliver to your doorstep in <strong>{state} State</strong>. You open the box, inspect the part and accessories, and pay via cash or mobile transfer.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lagos &amp; Abuja: 24 – 48 Hours Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Other States: 2 – 4 Days Fast Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customer Support Hotline Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
