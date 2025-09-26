import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query
  const query = role ? { role } : {}
  const users = await User.find(query).select("-password")
  res.status(200).json(new ApiResponse(200, users, "Users fetched"))
})
