import type { CarModel, ColorOption, LayerAsset, WheelOption } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { catalogSeed } from "./catalogSeed.js";
import { prisma } from "./prisma.js";

export type CatalogModel = CarModel & {
  layers: LayerAsset[];
  colors: ColorOption[];
  wheels: WheelOption[];
};

const includeOptions = {
  layers: { orderBy: { order: "asc" as const } },
  colors: { orderBy: { sortOrder: "asc" as const } },
  wheels: { orderBy: { sortOrder: "asc" as const } }
};

function sortSeedModels() {
  return [...catalogSeed].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function seedCatalog() {
  for (const model of catalogSeed) {
    await prisma.carModel.upsert({
      where: { id: model.id },
      update: {
        name: model.name,
        trim: model.trim,
        description: model.description,
        available: model.available,
        badge: model.badge,
        sortOrder: model.sortOrder,
        specs: model.specs ?? Prisma.JsonNull,
        layers: {
          deleteMany: {},
          create: Array.isArray(model.layers?.create) ? model.layers.create : []
        },
        colors: {
          deleteMany: {},
          create: Array.isArray(model.colors?.create) ? model.colors.create : []
        },
        wheels: {
          deleteMany: {},
          create: Array.isArray(model.wheels?.create) ? model.wheels.create : []
        }
      },
      create: model
    });
  }
}

export async function getCatalogModels(): Promise<CatalogModel[]> {
  try {
    return await prisma.carModel.findMany({
      orderBy: { sortOrder: "asc" },
      include: includeOptions
    });
  } catch (error) {
    if (process.env.LOG_DATABASE_FALLBACK === "true") {
      console.warn("Database catalog unavailable, serving seed catalog.", error);
    }

    return sortSeedModels().map((model) => ({
      id: model.id,
      name: model.name,
      trim: model.trim,
      description: model.description,
      available: model.available ?? true,
      badge: model.badge ?? null,
      sortOrder: model.sortOrder,
      specs: (model.specs ?? {}) as Prisma.JsonValue,
      createdAt: new Date(),
      updatedAt: new Date(),
      layers: (Array.isArray(model.layers?.create) ? model.layers.create : []).map((layer, index) => ({
        id: `${model.id}-layer-${layer.role}`,
        modelId: model.id,
        role: String(layer.role),
        url: String(layer.url),
        visible: layer.visible ?? true,
        order: layer.order ?? index + 1
      })),
      colors: (Array.isArray(model.colors?.create) ? model.colors.create : []).map((color) => ({
        id: String(color.id),
        modelId: model.id,
        name: String(color.name),
        hex: String(color.hex),
        sortOrder: color.sortOrder ?? 0
      })),
      wheels: (Array.isArray(model.wheels?.create) ? model.wheels.create : []).map((wheel) => ({
        id: String(wheel.id),
        modelId: model.id,
        name: String(wheel.name),
        finish: String(wheel.finish),
        colorHex: String(wheel.colorHex),
        roughness: Number(wheel.roughness),
        metalness: Number(wheel.metalness),
        sortOrder: wheel.sortOrder ?? 0
      }))
    }));
  }
}

export async function getCatalogModel(id: string) {
  const models = await getCatalogModels();
  return models.find((model) => model.id === id) ?? null;
}

export async function saveConfiguration(input: {
  modelId: string;
  colorId: string;
  wheelId: string;
  daylight: boolean;
}) {
  try {
    return await prisma.visualizationConfig.create({ data: input });
  } catch (error) {
    if (process.env.LOG_DATABASE_FALLBACK === "true") {
      console.warn("Database configuration save unavailable, returning transient configuration.", error);
    }

    return {
      id: `transient-${Date.now()}`,
      ...input,
      createdAt: new Date(),
      persisted: false
    };
  }
}
