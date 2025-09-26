import { v4 as uuidv4 } from "uuid";
import { Counter } from "../models/counter.model.js";

/**
 * Generates a ticketId depending on mode
 * sequential => TS-YYYY-0001
 * uuid       => TS-YYYY-xxxx-uuid
 */
export const generateTicketId = async () => {
  const year = new Date().getFullYear();
  const mode = process.env.TICKET_ID_MODE || "sequential";

  if (mode === "uuid") {
    const short = uuidv4().split("-")[0];
    return `TS-${year}-${short}`;
  }

  // Sequential fallback
  const counterName = `ticket-${year}`;
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(4, "0");
  return `TS-${year}-${padded}`;
};
