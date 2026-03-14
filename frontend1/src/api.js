const BASE = "http://localhost:5000/api/v1"; // change port to match yours

export const getTasks = () =>
  fetch(`${BASE}/tasks`).then((r) => r.json());

export const addTask = (text, time) =>
  fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, time }),
  }).then((r) => r.json());

export const toggleTask = (id) =>
  fetch(`${BASE}/tasks/${id}/toggle`, { method: "PATCH" }).then((r) => r.json());

export const deleteTask = (id) =>
  fetch(`${BASE}/tasks/${id}`, { method: "DELETE" }).then((r) => r.json());