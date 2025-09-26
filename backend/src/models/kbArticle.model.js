import mongoose from "mongoose";

const kbSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    keywords: [{ type: String }],
    department: { type: String, enum: ["Technical Support", "Billing", "General Inquiry"] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

kbSchema.index({ title: "text", keywords: "text", content: "text" });

export const KbArticle = mongoose.model("KbArticle", kbSchema);
