import express from "express"
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js"
import { getUsers } from "../controllers/user.controller.js"

const router = express.Router()

// Only Admins can list users (like Agents)
router.get("/", authMiddleware, requireRole(["Admin"]), getUsers)

export default router
