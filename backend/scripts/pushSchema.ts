import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements = [
  `
    create table if not exists "CarModel" (
      "id" text primary key,
      "name" text not null,
      "trim" text not null,
      "description" text not null,
      "available" boolean not null default true,
      "badge" text,
      "sortOrder" integer not null,
      "specs" jsonb not null,
      "createdAt" timestamp(3) not null default current_timestamp,
      "updatedAt" timestamp(3) not null default current_timestamp
    )
  `,
  `
    create table if not exists "LayerAsset" (
      "id" text primary key,
      "modelId" text not null references "CarModel"("id") on delete cascade on update cascade,
      "role" text not null,
      "url" text not null,
      "visible" boolean not null default true,
      "order" integer not null
    )
  `,
  `
    create table if not exists "ColorOption" (
      "id" text primary key,
      "modelId" text not null references "CarModel"("id") on delete cascade on update cascade,
      "name" text not null,
      "hex" text not null,
      "sortOrder" integer not null
    )
  `,
  `
    create table if not exists "WheelOption" (
      "id" text primary key,
      "modelId" text not null references "CarModel"("id") on delete cascade on update cascade,
      "name" text not null,
      "finish" text not null,
      "colorHex" text not null,
      "roughness" double precision not null,
      "metalness" double precision not null,
      "sortOrder" integer not null
    )
  `,
  `
    create table if not exists "VisualizationConfig" (
      "id" text primary key,
      "modelId" text not null references "CarModel"("id") on delete cascade on update cascade,
      "colorId" text not null,
      "wheelId" text not null,
      "daylight" boolean not null default true,
      "createdAt" timestamp(3) not null default current_timestamp
    )
  `
];

for (const statement of statements) {
  await prisma.$executeRawUnsafe(statement);
}

await prisma.$disconnect();

console.log("DriveViz Prisma schema tables are ready.");
