import { kv } from "@vercel/kv";

const INDEX_KEY = "requests:index";

export async function listRequests() {
  const ids = (await kv.smembers(INDEX_KEY)) || [];
  const items = await Promise.all(ids.map((id) => kv.get(`request:${id}`)));
  return items.filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getRequest(id) {
  return (await kv.get(`request:${id}`)) || null;
}

export async function createRequest({ id, name, email, service, budget, message }) {
  const item = {
    id,
    name,
    email,
    service,
    budget: budget || "",
    status: "new",
    quote: null,
    createdAt: Date.now(),
    thread: [{ from: "client", text: message, ts: Date.now() }],
  };
  await kv.set(`request:${id}`, item);
  await kv.sadd(INDEX_KEY, id);
  return item;
}

export async function addMessage(id, from, text) {
  const item = await kv.get(`request:${id}`);
  if (!item) return null;
  item.thread.push({ from, text, ts: Date.now() });
  await kv.set(`request:${id}`, item);
  return item;
}

export async function setQuote(id, amount) {
  const item = await kv.get(`request:${id}`);
  if (!item) return null;
  item.quote = amount;
  item.status = "quoted";
  await kv.set(`request:${id}`, item);
  return item;
}

export async function markPaid(id) {
  const item = await kv.get(`request:${id}`);
  if (!item) return null;
  item.status = "paid";
  await kv.set(`request:${id}`, item);
  return item;
}
