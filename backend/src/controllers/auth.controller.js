import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = (user) => {
  const payload = { _id: user._id, role: user.role, email: user.email };
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET, // ✅ always use ACCESS_TOKEN_SECRET
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "10h" }
  );
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, departments } = req.body;
  if (!name || !email || !password) throw new ApiError(400, "name, email, password required");

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "User already exists");

  const user = new User({
    name,
    email,
    password,
    role: role || "Customer",
    departments: departments || [],
  });
  await user.save();

  const token = generateToken(user);
  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
      "User created"
    )
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "email and password required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = generateToken(user);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
      "Login successful"
    )
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  // If using cookies, clear cookie. For stateless JWT, client should discard token.
  res.clearCookie("accessToken");
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
