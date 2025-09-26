import { Router } from "express";
import { query, body } from "express-validator";
import { searchArticles, createArticle } from "../controllers/kb.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.get("/search", [query("q").optional().isString()], validateRequest, searchArticles);

router.post("/", authMiddleware, roleMiddleware(["Admin"]), [body("title").isString().notEmpty(), body("content").isString().notEmpty(), body("department").optional().isIn(["Technical Support", "Billing", "General Inquiry"])], validateRequest, createArticle);

export default router;
