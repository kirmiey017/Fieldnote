// Simple JSON-file data store.
//
// This works well if you're hosting on a server with a persistent disk
// (a VPS, Render, Railway, etc.). If you deploy to a serverless platform
// like Vercel, the filesystem is NOT persistent between requests — swap
// this file for a real database (Postgres via Supabase/Neon, or Turso)
// before going live there. Every function below is small on purpose so
// swapping the implementation later is a one-file change.

import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "requests.json");

function ensureFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, "[]", "utf-8");
  }
}

function readAll() {
  ensureFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAll(items) {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export function listRequests() {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function getRequest(id) {
  return readAll().find((r) => r.id === id) || null;
}

export function createRequest({ id, name, email, service, budget, message }) {
  const items = readAll();
  const item = {
    id,
    name,
    email,
    service,
    budget: budget || "",
    status: "new", // new -> quoted -> paid
    quote: null,
    createdAt: Date.now(),
    thread: [{ from: "client", text: message, ts: Date.now() }],
  };
  items.push(item);
  writeAll(items);
  return item;
}

export function addMessage(id, from, text) {
  const items = readAll();
  const item = items.find((r) => r.id === id);
  if (!item) return null;
  item.thread.push({ from, text, ts: Date.now() });
  writeAll(items);
  return item;
}

export function setQuote(id, amount) {
  const items = readAll();
  const item = items.find((r) => r.id === id);
  if (!item) return null;
  item.quote = amount;
  item.status = "quoted";
  writeAll(items);
  return item;
}

export function markPaid(id) {
  const items = readAll();
  const item = items.find((r) => r.id === id);
  if (!item) return null;
  item.status = "paid";
  writeAll(items);
  return item;
    }
