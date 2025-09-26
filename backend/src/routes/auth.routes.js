import { Router } from "express"
import { body } from "express-validator"
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js"
import { validateRequest } from "../middleware/validation.middleware.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

router.post(
  "/register",
  [
    body("name").isString().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  validateRequest,
  registerUser
)

router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().notEmpty()],
  validateRequest,
  loginUser
)

router.post("/logout", authMiddleware, logoutUser)

export default router
