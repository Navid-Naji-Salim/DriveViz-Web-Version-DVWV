import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const database = await prisma.$queryRawUnsafe<Array<{ db: string }>>("select current_database() as db");
const tables = await prisma.$queryRawUnsafe<Array<{ table_schema: string; table_name: string }>>(
  "select table_schema, table_name from information_schema.tables where table_schema = 'public' order by table_name"
);

console.log(JSON.stringify({ database, tables }, null, 2));

await prisma.$disconnect();
