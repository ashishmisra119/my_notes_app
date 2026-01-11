#!/usr/bin/env node
// Simple smoke test for the deployed stack using Node's fetch
const base = process.argv[2] || "http://localhost:5173";
const username = `demo_${Date.now()}`;
(async () => {
  console.log(`Using base: ${base}`);
  console.log(`Registering ${username}`);
  let res = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "password123" }),
  });
  console.log(`Register: ${res.status}`);

  res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "password123" }),
  });
  if (!res.ok) {
    console.error("Login failed", res.status);
    process.exit(1);
  }
  const data = await res.json();
  console.log("Login success, token length:", data.token?.length || 0);

  const token = data.token;
  const noteRes = await fetch(`${base}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Smoke test note",
      content: "Created by smoke test",
    }),
  });
  console.log(`Create note: ${noteRes.status}`);

  const listRes = await fetch(`${base}/api/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`Get notes: ${listRes.status}`);
  const notes = await listRes.json();
  console.log("Notes:", notes);
})();
