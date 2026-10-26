export type Feature = {
  name: string;
  label: string;
  kind: 'number' | 'category';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
};

export const FEATURES: Feature[] = [
  { name: "Rotor speed (RPM)", label: "Rotor speed (RPM)", kind: 'number', required: true, min: 0.0, max: 15.3432010710239 },
  { name: "Rotor speed, Min (RPM)", label: "Rotor speed, Min (RPM)", kind: 'number', required: true, min: 0.0, max: 15.2214020490646 },
  { name: "Rotor speed, Max (RPM)", label: "Rotor speed, Max (RPM)", kind: 'number', required: true, min: 0.0, max: 16.6100531816483 },
  { name: "Blade angle (pitch position) C (°)", label: "Blade angle (pitch position) C (°)", kind: 'number', required: true, min: -170.11999511718798, max: 94.6989279352875 },
  { name: "Blade angle (pitch position) A (°)", label: "Blade angle (pitch position) A (°)", kind: 'number', required: true, min: -170.11999511718798, max: 92.9000015258789 },
  { name: "Blade angle (pitch position) B (°)", label: "Blade angle (pitch position) B (°)", kind: 'number', required: true, min: -170.16999816894497, max: 94.3949219185602 },
  { name: "Temperature motor axis 1 (°C)", label: "Temperature motor axis 1 (°C)", kind: 'number', required: true, min: 6.0, max: 215.0 },
  { name: "Blade angle (pitch position) C, Max (°)", label: "Blade angle (pitch position) C, Max (°)", kind: 'number', required: true, min: -170.119995117188, max: 95.9199981689453 },
  { name: "Density adjusted wind speed (m/s)", label: "Density adjusted wind speed (m/s)", kind: 'number', required: true, min: 0.1425106768360037, max: 24.10281258691402 },
  { name: "Wind speed (m/s)", label: "Wind speed (m/s)", kind: 'number', required: true, min: 0.1419003680348396, max: 24.2590686798096 },
  { name: "Wind speed Sensor 1 (m/s)", label: "Wind speed Sensor 1 (m/s)", kind: 'number', required: true, min: -0.7614551343415911, max: 25.2547982215881 },
  { name: "Temperature motor axis 3, StdDev (°C)", label: "Temperature motor axis 3, StdDev (°C)", kind: 'number', required: true, min: 0.0, max: 99.44928355699702 },
];
