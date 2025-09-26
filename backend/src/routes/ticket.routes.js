import { Router } from "express";
import { body } from "express-validator";
import { createTicket, getTickets, getTicketById, assignTicket, addChatMessage } from "../controllers/ticket.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  [body("title").isString().notEmpty(), body("description").isString().notEmpty(), body("department").isIn(["Technical Support", "Billing", "General Inquiry"])],
  validateRequest,
  createTicket
);

router.get("/", authMiddleware, getTickets);

router.get("/:id", authMiddleware, getTicketById);

router.put("/:id/assign", authMiddleware, roleMiddleware(["Admin", "Agent"]), [body("agentId").optional().isMongoId(), body("status").optional().isIn(["New", "Open", "In Progress", "Resolved", "Closed"])], validateRequest, assignTicket);

router.post("/:id/messages", authMiddleware, [body("text").isString().notEmpty()], validateRequest, addChatMessage);

export default router;
