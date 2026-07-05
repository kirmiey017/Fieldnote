import { getRequest } from "../../../lib/db";
import DashboardDetail from "./DashboardDetail";

export default async function DashboardRequestPage({ params }) {
  const item = await getRequest(params.id);
  if (!item) {
    return <div className="wrap">Request not found.</div>;
  }
  return (
    <div className="dashboard-wrap">
      <div>
        <a href="/dashboard" style={{ color: "#F2EFE6", fontSize: 13, textDecoration: "underline" }}>
          ← Back to all requests
        </a>
      </div>
      <DashboardDetail item={item} />
    </div>
  );
}
