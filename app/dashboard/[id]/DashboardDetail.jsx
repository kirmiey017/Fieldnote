"use client";

import { useState, useTransition } from "react";
import { addConsultantMessageAction, sendQuoteAction, markPaidManualAction } from "../../actions";
import { STATUS_META } from "../../../lib/statusMeta";

export default function DashboardDetail({ item }) {
  const [thread, setThread] = useState(item.thread);
  const [status, setStatus] = useState(item.status);
  const [quote, setQuote] = useState(item.quote);
  const [reply, setReply] = useState("");
  const [quoteInput, setQuoteInput] = useState("");
  const [, startTransition] = useTransition();
  const meta = STATUS_META[status];

  function sendReply() {
    if (!reply.trim()) return;
    const text = reply.trim();
    setThread((t) => [...t, { from: "consultant", text, ts: Date.now() }]);
    setReply("");
    startTransition(() => addConsultantMessageAction(item.id, text));
  }

  function sendQuote() {
    if (!quoteInput) return;
    const amount = quoteInput;
    setThread((t) => [...t, { from: "consultant", text: `Here's a quote for this scope: $${amount}.`, ts: Date.now() }]);
    setStatus("quoted");
    setQuote(amount);
    setQuoteInput("");
    startTransition(() => sendQuoteAction(item.id, amount));
  }

  function markPaid() {
    setStatus("paid");
    startTransition(() => markPaidManualAction(item.id));
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{item.name}</div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>{item.email} · budget: {item.budget || "not specified"}</div>
        </div>
        <span className="status-row">
          <span className="dot" style={{ background: meta.dot }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{meta.label}</span>
        </span>
      </div>

      <div className="thread">
        {thread.map((m, i) => (
          <div key={i} className="bubble-row" style={{ justifyContent: m.from === "client" ? "flex-end" : "flex-start" }}>
            <div className={m.from === "client" ? "bubble-client" : "bubble-consultant"}>{m.text}</div>
          </div>
        ))}
      </div>

      {status !== "paid" && (
        <div className="reply-row" style={{ marginBottom: 12 }}>
          <input
            className="input"
            style={{ width: 120 }}
            placeholder="Quote $"
            value={quoteInput}
            onChange={(e) => setQuoteInput(e.target.value.replace(/[^0-9]/g, ""))}
          />
          <button className="btn-small" onClick={sendQuote} disabled={!quoteInput}>Send quote</button>
          {status === "quoted" && (
            <button className="btn-pay" onClick={markPaid} style={{ marginLeft: "auto" }}>
              Mark paid manually
            </button>
          )}
        </div>
      )}

      <div className="reply-row">
        <input
          className="input"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply to client…"
          onKeyDown={(e) => e.key === "Enter" && sendReply()}
        />
        <button className="btn-small" onClick={sendReply}>Send</button>
      </div>
    </div>
  );
}
