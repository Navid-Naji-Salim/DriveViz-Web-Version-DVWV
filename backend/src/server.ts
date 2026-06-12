import "dotenv/config";
import cors from "cors";
import express from "express";
import type { Server } from "node:http";
import { getCatalogModel, getCatalogModels, saveConfiguration } from "./catalogRepository.js";
import { prisma } from "./prisma.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "driveviz-backend" });
});

app.get("/api/models", async (_request, response, next) => {
  try {
    response.json(await getCatalogModels());
  } catch (error) {
    next(error);
  }
});

app.get("/api/models/:id", async (request, response, next) => {
  try {
    const model = await getCatalogModel(request.params.id);

    if (!model) {
      response.status(404).json({ message: "Model not found" });
      return;
    }

    response.json(model);
  } catch (error) {
    next(error);
  }
});

app.post("/api/configurations", async (request, response, next) => {
  try {
    const { modelId, colorId, wheelId, daylight } = request.body as Record<string, unknown>;

    if (typeof modelId !== "string" || typeof colorId !== "string" || typeof wheelId !== "string") {
      response.status(400).json({ message: "modelId, colorId, and wheelId are required" });
      return;
    }

    const config = await saveConfiguration({
      modelId,
      colorId,
      wheelId,
      daylight: Boolean(daylight)
    });

    response.status(201).json(config);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ message: "Unexpected backend error" });
});

async function start() {
  const server: Server = app.listen(port, () => {
    console.log(`DriveViz backend listening on http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Stop the existing backend process or set PORT to another value in backend/.env.`
      );
      process.exit(1);
    }

    console.error(error);
    process.exit(1);
  });
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
