import type { CarModel } from "../types/catalog";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getModels() {
  return request<CarModel[]>("/api/models");
}

export function saveConfiguration(input: {
  modelId: string;
  colorId: string;
  wheelId: string;
  daylight: boolean;
}) {
  return request("/api/configurations", {
    method: "POST",
    body: JSON.stringify(input)
  });
}
