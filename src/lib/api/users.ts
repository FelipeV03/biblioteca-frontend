import type { User } from "@/types";
import { apiClient } from "./client";

export interface UserInput {
  name: string;
  email: string;
}

export function listUsers() {
  return apiClient<{ data: User[] }>("/users");
}

export function getUser(id: number) {
  return apiClient<{ data: User }>(`/users/${id}`);
}

export function createUser(input: UserInput) {
  return apiClient<{ data: User }>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
