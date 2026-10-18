export interface VehicleBrand {
  brand: string;
  popularModels: string[];
  fuelDelivery: string;
  status: 'Direct Fit (Plug & Play)' | 'Universal Modular Fit';
  notes: string;
}

export const COMPATIBILITY_DATA: VehicleBrand[] = [
  {
    brand: 'Toyota',
    popularModels: ['Corolla (2000-2022)', 'Camry (1998-2021)', 'RAV4 (2001-2020)', 'Highlander (2001-2019)', 'Sienna (1998-2020)', 'Yaris / Vitz', 'Matrix', 'Avalon', 'Tacoma', 'Hilux (Petrol)'],
    fuelDelivery: 'Multi-Point Electronic Fuel Injection (EFI / VVTi)',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Standard 38mm slim-canister body. Matches factory pump bracket and wire clip.',
  },
  {
    brand: 'Honda',
    popularModels: ['Accord (1998-2020)', 'Civic (1996-2020)', 'CR-V (1998-2021)', 'Pilot (2003-2018)', 'Odyssey (1999-2019)', 'City', 'Fit / Jazz'],
    fuelDelivery: 'Honda PGM-FI (VTEC / i-VTEC Engines)',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Direct swap in tank canister. Includes correct offset strainer sock in kit.',
  },
  {
    brand: 'Lexus',
    popularModels: ['ES300 / ES330 / ES350', 'RX300 / RX330 / RX350', 'IS250 / IS300 / IS350', 'GX470 / GX460', 'GS300 / GS350'],
    fuelDelivery: 'High-Pressure Sequential Injection (V6 / V8)',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Maintains required 3.8-4.2 Bar line pressure even during hot restart.',
  },
  {
    brand: 'Nissan',
    popularModels: ['Almera', 'Primera', 'Altima (2002-2020)', 'Maxima', 'Sentra', 'Pathfinder (2001-2018)', 'X-Trail', 'Murano'],
    fuelDelivery: 'Nissan EGI / Twin Cam Injection',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Eliminates typical high-temperature Nissan fuel vaporization and stall issues.',
  },
  {
    brand: 'Hyundai',
    popularModels: ['Elantra (2001-2021)', 'Sonata (1999-2021)', 'Santa Fe (2001-2020)', 'Accent', 'Tucson (2005-2021)', 'Genesis'],
    fuelDelivery: 'DOHC MPFI / GDI Low-Pressure Tank Feed',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Comes with wiring pigtail harness and rubber isolator boot.',
  },
  {
    brand: 'Kia',
    popularModels: ['Rio (2002-2021)', 'Cerato / Forte (2004-2021)', 'Optima (2001-2020)', 'Sportage (2001-2021)', 'Sorento (2003-2020)', 'Soul'],
    fuelDelivery: 'Multi-Point Fuel Injection',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Exact electrical terminal pinout and high-flow delivery.',
  },
  {
    brand: 'Mercedes-Benz',
    popularModels: ['C-Class (W203, W204 Petrol)', 'E-Class (W211, W212 Petrol)', 'ML350 / GL450 (Petrol)', 'CLK320 / CLK350'],
    fuelDelivery: 'Bosch / Siemens Electronic Injection',
    status: 'Universal Modular Fit',
    notes: 'Universal in-tank replacement with supplied submersible hose & clamps.',
  },
  {
    brand: 'Ford',
    popularModels: ['Focus (2000-2018)', 'Escape (2001-2019)', 'Explorer (Petrol)', 'Edge (2007-2018)', 'Fusion (2006-2020)', 'Ranger (Petrol)'],
    fuelDelivery: 'Duratec / EcoBoost Tank Feeder Pump',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Prevents fuel starvation during uphill acceleration.',
  },
  {
    brand: 'Mitsubishi',
    popularModels: ['Lancer', 'Galant', 'Pajero / Montero (Petrol)', 'Outlander', 'Space Wagon'],
    fuelDelivery: 'ECI-MULTI Electronic Fuel Injection',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Resistant to sulfur and water impurities commonly found in fuel.',
  },
  {
    brand: 'Mazda',
    popularModels: ['Mazda 3 (2004-2018)', 'Mazda 6 (2003-2019)', 'CX-5', 'CX-7', 'CX-9', 'Tribute', 'Premacy'],
    fuelDelivery: 'SkyActiv & MZR Electronic Injection',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Smooth, continuous 150 LPH flow rate.',
  },
  {
    brand: 'Peugeot',
    popularModels: ['206', '307', '406', '407', '301', '508 (Petrol)'],
    fuelDelivery: 'Magneti Marelli / Bosch Injection',
    status: 'Direct Fit (Plug & Play)',
    notes: 'Direct swap in tank assembly with included hardware.',
  },
  {
    brand: 'Volkswagen',
    popularModels: ['Golf 4 / Golf 5 / Golf 6', 'Passat (B5, B6, B7)', 'Jetta', 'Tiguan (Petrol)', 'Polo'],
    fuelDelivery: 'Motronic MPFI & FSI In-Tank Lift Feeder',
    status: 'Universal Modular Fit',
    notes: 'High endurance turbine eliminates whining pump noise.',
  },
];
