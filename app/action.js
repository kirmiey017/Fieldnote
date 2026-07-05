"use server";

import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as db from "../lib/db";
import { notifyConsultantOfNewRequest, notifyClientOfReply } from "../lib/email";
import { checkPassword, makeSessionCookieValue, SESSION_COOKIE_NAME } from "../lib/auth";

function makeRef() {
  const n = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const ym = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `C-${ym}-${n}`;
}

export async function submitRequestAction(formData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const service = formData.get("service")?.toString();
  const budget = formData.get("budget")?.toString();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    throw new Error("Missing required fields");
  }

  const id = makeRef();
  const item = db.createRequest({ id, name, email, service, budget, message });
  await notifyConsultantOfNewRequest(item);
  redirect(`/request/${id}`);
}

export async function addClientMessageAction(id, text) {
  if (!text?.trim()) return;
  db.addMessage(id, "client", text.trim());
}

export async function addConsultantMessageAction(id, text) {
  if (!text?.trim()) return;
  const item = db.addMessage(id, "consultant", text.trim());
  if (item) await notifyClientOfReply(item);
}

export async function sendQuoteAction(id, amount, note) {
  const item = db.setQuote(id, amount);
  const text = note?.trim()
    ? `${note.trim()} — quote: $${amount}`
    : `Here's a quote for this scope: $${amount}.`;
  const updated = db.addMessage(id, "consultant", text);
  if (updated) await notifyClientOfReply(updated);
  return item;
}

export async function markPaidManualAction(id) {
  db.markPaid(id);
}

export async function loginAction(formData) {
  const password = formData.get("password")?.toString() || "";
  if (!checkPassword(password)) {
    redirect("/dashboard/login?error=1");
  }
  cookies().set(SESSION_COOKIE_NAME, makeSessionCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  redirect("/dashboard");
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect("/dashboard/login");
    }
