import { seedCatalog } from "../src/catalogRepository.js";
import { prisma } from "../src/prisma.js";

await seedCatalog();
await prisma.$disconnect();

console.log("Toyota catalog seeded.");
