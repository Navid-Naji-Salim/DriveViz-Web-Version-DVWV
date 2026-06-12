import type { Prisma } from "@prisma/client";

export type CatalogModelSeed = Prisma.CarModelCreateInput & {
  id: string;
};

export const catalogSeed: CatalogModelSeed[] = [
  {
    id: "crown-platinum",
    name: "Crown",
    trim: "Platinum - Hybrid MAX AWD",
    description: "Toyota Crown visualization asset set currently installed in the project.",
    available: true,
    badge: "NEW",
    sortOrder: 1,
    specs: {
      power: "340 HP",
      torque: "400 lb-ft",
      accel: "5.7s",
      drive: "AWD",
      city: "29",
      hwy: "32",
      comb: "30",
      fuel: "Hybrid",
      len: "196 in",
      wb: "112 in"
    },
    layers: {
      create: [
        { role: "body", url: "/models/body.glb", order: 1 },
        { role: "interior", url: "/models/Interiors.glb", order: 2 },
        { role: "wheels", url: "/models/Wheels_1.glb", order: 3 }
      ]
    },
    colors: {
      create: [
        { id: "heavy-metal", name: "Heavy Metal / Black", hex: "#1a1c1c", sortOrder: 1 },
        { id: "wind-chill-pearl", name: "Wind Chill Pearl", hex: "#f0eeec", sortOrder: 2 },
        { id: "supersonic-red", name: "Supersonic Red", hex: "#8e0000", sortOrder: 3 },
        { id: "blueprint", name: "Blueprint", hex: "#1e3a5f", sortOrder: 4 },
        { id: "oxide-bronze", name: "Oxide Bronze", hex: "#a38c6d", sortOrder: 5 },
        { id: "midnight-black", name: "Midnight Black", hex: "#0d0d0d", sortOrder: 6 }
      ]
    },
    wheels: {
      create: [
        {
          id: "split-spoke-alloy",
          name: "21-in. Split-Spoke Alloy",
          finish: "Machined finish - Included",
          assetUrl: "/models/Wheels_1.glb",
          colorHex: "#9ca3af",
          roughness: 0.28,
          metalness: 0.82,
          sortOrder: 1
        },
        {
          id: "forged-black",
          name: "21-in. Forged Black",
          finish: "Gloss black multi-spoke",
          assetUrl: "/models/Wheels_2.glb",
          colorHex: "#0d0d0d",
          roughness: 0.48,
          metalness: 0.66,
          sortOrder: 2
        },
        {
          id: "dark-chrome",
          name: "20-in. Dark Chrome",
          finish: "Layered sport design",
          assetUrl: "/models/Wheels_3.glb",
          colorHex: "#4b5563",
          roughness: 0.24,
          metalness: 0.86,
          sortOrder: 3
        },
        {
          id: "premium-machined",
          name: "22-in. Premium Machined",
          finish: "Bright machined face",
          assetUrl: "/models/Wheels_4.glb",
          colorHex: "#c8c8c8",
          roughness: 0.18,
          metalness: 0.92,
          sortOrder: 4
        }
      ]
    }
  },
  {
    id: "camry-xse",
    name: "Camry",
    trim: "XSE - 2.5L 4-Cylinder",
    description: "Awaiting dedicated GLB layers.",
    available: false,
    sortOrder: 2,
    specs: {
      power: "203 HP",
      torque: "184 lb-ft",
      accel: "7.2s",
      drive: "FWD",
      city: "28",
      hwy: "39",
      comb: "32",
      fuel: "Gasoline",
      len: "192 in",
      wb: "111 in"
    }
  },
  {
    id: "gr-supra-3",
    name: "GR Supra",
    trim: "3.0 - Turbocharged",
    description: "Awaiting dedicated GLB layers.",
    available: false,
    badge: "GR",
    sortOrder: 3,
    specs: {
      power: "382 HP",
      torque: "368 lb-ft",
      accel: "3.9s",
      drive: "RWD",
      city: "22",
      hwy: "30",
      comb: "25",
      fuel: "Premium",
      len: "172 in",
      wb: "97 in"
    }
  },
  {
    id: "rav4-xse",
    name: "RAV4",
    trim: "XSE Hybrid - AWD",
    description: "Awaiting dedicated GLB layers.",
    available: false,
    sortOrder: 4,
    specs: {
      power: "219 HP",
      torque: "163 lb-ft",
      accel: "7.4s",
      drive: "AWD",
      city: "41",
      hwy: "38",
      comb: "40",
      fuel: "Hybrid",
      len: "180 in",
      wb: "105 in"
    }
  }
];
