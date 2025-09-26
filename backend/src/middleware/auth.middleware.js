import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

/**
 * Verifies JWT and attaches user to request
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new ApiError(401, "Unauthorized: No token provided");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded || !decoded._id) throw new ApiError(401, "Unauthorized: Invalid token");

    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new ApiError(401, "Unauthorized: User not found");

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    next(new ApiError(401, "Unauthorized: Invalid or expired token"));
  }
};

/**
 * Restrict route to specific roles
 */
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient role"));
    }
    next();
  };
};
