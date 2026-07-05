"use client";

import { useState, useTransition } from "react";
import { addClientMessageAction } from "../../actions";
import { STATUS_META } from "../../../lib/statusMeta";

export default function TicketView({ item }) {
  const [thread, setThread] = useState(item.thread);
  const [reply, setReply] = useState("");
  const [isPending, startTransition] = useTransition();
  const [paying, setPaying] = useState(false);
  const meta = STATUS_META[item.status];

  function send() {
    if (!reply.trim()) return;
    const text = reply.trim();
    setThread((t) => [...t, { from: "client", text, ts: Date.now() }]);
    setReply("");
    startTransition(() => addClientMessageAction(item.id, text));
  }

  async function pay() {
    setPaying(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setPaying(false);
      alert(data.error || "Could not start checkout. Please try again.");
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div className="ticket-ref">{item.id}</div>
          <span className="status-row">
            <span className="dot" style={{ background: meta.dot }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{meta.label}</span>
          </span>
        </div>
        <a href="/" style={{ fontSize: 13, color: "#3B4B8C", textDecoration: "underline" }}>
          Start another request
        </a>
      </div>

      <div className="thread">
        {thread.map((m, i) => (
          <div key={i} className="bubble-row">
            <div className={m.from === "client" ? "bubble-client" : "bubble-consultant"}>{m.text}</div>
          </div>
        ))}
      </div>

      {item.status === "quoted" && (
        <div className="quote-banner">
          <div>
            <div className="quote-label">Quote</div>
            <div className="quote-amount">${item.quote}</div>
          </div>
          <button className="btn-pay" onClick={pay} disabled={paying}>
            {paying ? "Redirecting…" : "Pay now"}
          </button>
        </div>
      )}

      {item.status === "paid" && (
        <div className="quote-banner" style={{ background: "#EAF2ED" }}>
          <div style={{ color: "#2E5B41", fontWeight: 600 }}>Paid — I'll be in touch to kick things off.</div>
        </div>
      )}

      <div className="reply-row">
        <input
          className="input"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Reply…"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="btn-small" onClick={send} disabled={isPending}>Send</button>
      </div>
    </div>
  );
                                                                                                   }
