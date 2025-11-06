import api from "./api";
import type { UserBasic } from "./interfaces";

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  console.log("retorno da api /auth/login: ", data);
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}

export async function register(email: string, name: string, password: string) {
  const { data } = await api.post("/auth/register", { email, name, password });
  console.log("retorno da api /auth/register: ", data);
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Sem refresh token");

  const { data } = await api.post("/auth/refresh", { refreshToken });
  console.log("retorno da api /auth/refresh: ", data);
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function fetchUsers(): Promise<UserBasic[]> {
  const { data } = await api.get("/auth/users");
  return data as UserBasic[];
}
