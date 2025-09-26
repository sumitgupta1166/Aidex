import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ticketSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ticketId: { type: String, required: true, unique: true, index: true },
    department: {
      type: String,
      required: true,
      enum: ["Technical Support", "Billing", "General Inquiry"]
    },
    status: {
      type: String,
      enum: ["New", "Open", "In Progress", "Resolved", "Closed"],
      default: "New",
      index: true
    },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Low" },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    chat: [chatSchema]
  },
  { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
