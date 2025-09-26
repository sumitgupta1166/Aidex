import { ApiError } from "./ApiError.js";

export const asyncHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      console.error("Unhandled handler error:", err);
      const statusCode = err?.statusCode || 500;
      const message = err?.message || "Internal Server Error";
      const errors = err?.errors || [];
      res.status(statusCode).json({ success: false, message, errors });
    }
  };
};
