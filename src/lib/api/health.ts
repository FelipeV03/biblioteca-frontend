import { apiClient } from "./client";

export interface HealthResponse {
  data: { status: string };
}

export function getHealth() {
  return apiClient<HealthResponse>("/health");
}
