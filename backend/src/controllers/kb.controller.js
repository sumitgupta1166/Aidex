import { KbArticle } from "../models/kbArticle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchArticles = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  if (!q.trim()) return res.status(200).json(new ApiResponse(200, [], "No query"));
  const results = await KbArticle.find({ $text: { $search: q } }).limit(200);
  res.status(200).json(new ApiResponse(200, results, "Search results"));
});

export const createArticle = asyncHandler(async (req, res) => {
  const { title, content, keywords = [], department } = req.body;
  if (!title || !content) throw new ApiError(400, "title and content required");
  const article = new KbArticle({ title, content, keywords, department, author: req.user._id });
  await article.save();
  res.status(201).json(new ApiResponse(201, article, "Knowledge base article created"));
});
