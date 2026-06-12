export type VehicleSpecs = {
  power: string;
  torque: string;
  accel: string;
  drive: string;
  city: string;
  hwy: string;
  comb: string;
  fuel: string;
  len: string;
  wb: string;
};

export type LayerAsset = {
  id: string;
  role: "body" | "interior" | "wheels" | string;
  url: string;
  visible: boolean;
  order: number;
};

export type ColorOption = {
  id: string;
  name: string;
  hex: string;
  sortOrder: number;
};

export type WheelOption = {
  id: string;
  name: string;
  finish: string;
  colorHex: string;
  roughness: number;
  metalness: number;
  sortOrder: number;
};

export type CarModel = {
  id: string;
  name: string;
  trim: string;
  description: string;
  available: boolean;
  badge: string | null;
  specs: VehicleSpecs;
  layers: LayerAsset[];
  colors: ColorOption[];
  wheels: WheelOption[];
};
