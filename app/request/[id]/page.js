import { getRequest } from "../../../lib/db";
import TicketView from "./TicketView";

export default async function RequestPage({ params }) {
  const item = await getRequest(params.id);

  if (!item) {
    return (
      <div className="wrap">
        <div className="empty-state">
          <div className="empty-title">Request not found</div>
          <div>Double check the link, or submit a new request from the home page.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <TicketView item={item} />
    </div>
  );
}
