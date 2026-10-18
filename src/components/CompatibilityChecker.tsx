import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, Car, AlertCircle, ArrowRight } from 'lucide-react';
import { COMPATIBILITY_DATA, VehicleBrand } from '../data/compatibilityData';

interface CompatibilityCheckerProps {
  onSelectVehicleForOrder: (make: string, model: string) => void;
}

export const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ onSelectVehicleForOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  const brands = useMemo(() => {
    return ['All', ...COMPATIBILITY_DATA.map((d) => d.brand)];
  }, []);

  const filteredData = useMemo(() => {
    return COMPATIBILITY_DATA.filter((item) => {
      const matchesBrand = selectedBrand === 'All' || item.brand === selectedBrand;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesBrand;

      const matchesSearch =
        item.brand.toLowerCase().includes(query) ||
        item.popularModels.some((m) => m.toLowerCase().includes(query)) ||
        item.fuelDelivery.toLowerCase().includes(query);

      return matchesBrand && matchesSearch;
    });
  }, [searchQuery, selectedBrand]);

  return (
    <section id="compatibility" className="py-16 lg:py-20 bg-neutral-100 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600">
            <span>WIDE COMPATIBILITY</span>
            <span aria-hidden="true">·</span>
            <span>JAPANESE, KOREAN, AMERICAN &amp; EUROPEAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-display">
            Check If Your Car Is Compatible
          </h2>
          <p className="text-base text-neutral-600">
            FRANKBLAISE ELECTRIC FUEL PUMP PLUS uses the universal 38mm slim-canister standard, providing direct plug-and-play fitment for over 95% of petrol fuel injection vehicles in Nigeria.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-3xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your car model (e.g. Camry, Accord, Corolla, RX350, Elantra)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-sm shadow-sm transition-all"
            />
          </div>

          {/* Clean Segmented Brand Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBrand(b)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedBrand === b
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {filteredData.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-neutral-200">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-neutral-800 mb-1">Car Model Not in Quick List?</h3>
            <p className="text-xs text-neutral-600 mb-4">
              Don’t worry! If your vehicle uses an electric in-tank fuel pump with 12V DC power, Frankblaise Electric Fuel Pump Plus will fit. You can still order and our technician will verify your vehicle year upon delivery dispatch.
            </p>
            <button
              onClick={() => onSelectVehicleForOrder(searchQuery, 'Custom')}
              type="button"
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Order With My Model &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item: VehicleBrand) => (
              <div
                key={item.brand}
                className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                        <Car className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 font-display">
                        {item.brand}
                      </h3>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {item.status === 'Direct Fit (Plug & Play)' ? '100% Direct Fit' : 'Universal Fit'}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 font-medium mb-3">
                    System: {item.fuelDelivery}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Verified Compatible Models:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.popularModels.map((m) => (
                        <span
                          key={m}
                          className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded border border-neutral-200 font-medium"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 mb-4">
                    <strong>Tech Note:</strong> {item.notes}
                  </p>
                </div>

                <button
                  onClick={() => onSelectVehicleForOrder(item.brand, item.popularModels[0].split(' ')[0])}
                  type="button"
                  className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-red-600 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Select {item.brand} For Delivery</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
