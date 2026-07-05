import { listRequests } from "../../lib/db";
import { STATUS_META } from "../../lib/statusMeta";
import { logoutAction } from "../actions";

export default function DashboardPage() {
  const requests = listRequests();

  return (
    <div className="dashboard-wrap">
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ color: "#F2EFE6", fontFamily: "'Fraunces', serif", fontSize: 18 }}>Requests</div>
          <form action={logoutAction}>
            <button type="submit" style={{ background: "none", border: "none", color: "#C9982E", fontSize: 12, cursor: "pointer" }}>
              Log out
            </button>
          </form>
        </div>

        {requests.length === 0 ? (
          <div style={{ color: "#F2EFE6", fontSize: 14, opacity: 0.75 }}>No requests yet.</div>
        ) : (
          <div className="request-list">
            {requests.map((r) => {
              const meta = STATUS_META[r.status];
              return (
                <a key={r.id} href={`/dashboard/${r.id}`} className="request-row">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600 }}>{r.name}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.6 }}>{r.id}</span>
                  </div>
                  <span className="status-row">
                    <span className="dot" style={{ background: meta.dot }} />
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{meta.label}</span>
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>

      <div className="card" style={{ color: "#5B5647" }}>
        Select a request on the left to view the conversation and reply.
      </div>
    </div>
  );
  }
