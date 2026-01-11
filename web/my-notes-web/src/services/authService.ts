const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${(import.meta.env.VITE_BACKEND_URL as string).replace(/\/$/, "")}/api`
  : "/api";

export async function register(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Register failed");
  return await res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return await res.json(); // { token, username }
}
