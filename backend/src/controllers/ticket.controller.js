// import { Ticket } from "../models/ticket.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { generateTicketId } from "../utils/ticketIdGenerator.js";
// import mongoose from "mongoose";

// /**
//  * createTicket
//  */
// export const createTicket = asyncHandler(async (req, res) => {
//   const { title, description, department, priority } = req.body;
//   if (!title || !description || !department) throw new ApiError(400, "title, description, department required");

//   const ticketId = await generateTicketId();
//   const ticket = new Ticket({
//     customer: req.user._id,
//     title,
//     description,
//     department,
//     priority: priority || "Low",
//     ticketId
//   });
//   await ticket.save();

//   if (global.__io) {
//     global.__io.to("role:Agent").emit("newTicketCreated", { ticketId: ticket.ticketId, title: ticket.title, department: ticket.department, status: ticket.status, priority: ticket.priority });
//     global.__io.to("role:Admin").emit("newTicketCreated", { ticketId: ticket.ticketId, title: ticket.title, department: ticket.department, status: ticket.status, priority: ticket.priority });
//   }

//   res.status(201).json(new ApiResponse(201, ticket, "Ticket created"));
// });

// /**
//  * getTickets
//  */
// export const getTickets = asyncHandler(async (req, res) => {
//   const { status, priority, department, sort = "-createdAt", page = 1, limit = 20 } = req.query;
//   const q = {};

//   if (req.user.role === "Customer") {
//     q.customer = req.user._id;
//   } else if (req.user.role === "Agent") {
//     q.$or = [
//       { assignedAgent: req.user._id },
//       { assignedAgent: null, department: { $in: req.user.departments || [] } }
//     ];
//   }

//   if (status) q.status = status;
//   if (priority) q.priority = priority;
//   if (department) q.department = department;

//   const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, parseInt(limit, 10));
//   const tickets = await Ticket.find(q).sort(sort).skip(skip).limit(Math.min(100, parseInt(limit, 10))).populate("customer assignedAgent", "name email role");
//   res.status(200).json(new ApiResponse(200, tickets, "Tickets fetched"));
// });

// /**
//  * getTicketById
//  */
// export const getTicketById = asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   let ticket;
//   if (mongoose.Types.ObjectId.isValid(id)) ticket = await Ticket.findById(id).populate("customer assignedAgent", "name email role");
//   if (!ticket) ticket = await Ticket.findOne({ ticketId: id }).populate("customer assignedAgent", "name email role");
//   if (!ticket) throw new ApiError(404, "Ticket not found");

//   const allowed = ticket.customer._id.equals(req.user._id) || (ticket.assignedAgent && ticket.assignedAgent._id.equals(req.user._id)) || req.user.role === "Admin";
//   if (!allowed) throw new ApiError(403, "Forbidden");

//   res.status(200).json(new ApiResponse(200, ticket, "Ticket fetched"));
// });

// /**
//  * assignTicket
//  */
// export const assignTicket = asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   const { agentId, status } = req.body;
//   const ticket = await Ticket.findById(id);
//   if (!ticket) throw new ApiError(404, "Ticket not found");

//   if (agentId) ticket.assignedAgent = agentId;
//   if (status) ticket.status = status;
//   await ticket.save();

//   if (global.__io) {
//     global.__io.to(`ticket:${ticket._id}`).emit("ticketUpdated", { ticketId: ticket.ticketId, status: ticket.status, assignedAgent: ticket.assignedAgent });
//   }

//   res.status(200).json(new ApiResponse(200, ticket, "Ticket assigned/updated"));
// });

// /**
//  * addChatMessage
//  */
// export const addChatMessage = asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   const { text } = req.body;
//   if (!text) throw new ApiError(400, "text required");

//   let ticket = await Ticket.findById(id);
//   if (!ticket) ticket = await Ticket.findOne({ ticketId: id });
//   if (!ticket) throw new ApiError(404, "Ticket not found");

//   const isParticipant = ticket.customer.equals(req.user._id) || (ticket.assignedAgent && ticket.assignedAgent.equals(req.user._id)) || req.user.role === "Admin";
//   if (!isParticipant) throw new ApiError(403, "Forbidden");

//   const message = { sender: req.user._id, text, timestamp: new Date() };
//   ticket.chat.push(message);
//   await ticket.save();

//   const lastMsg = ticket.chat[ticket.chat.length - 1];

//   if (global.__io) {
//     global.__io.to(`ticket:${ticket._id}`).emit("newMessage", { ticketId: ticket.ticketId, message: lastMsg });
//   }

//   res.status(201).json(new ApiResponse(201, lastMsg, "Message added"));
// });


import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateTicketId } from "../utils/ticketIdGenerator.js";
import mongoose from "mongoose";

/**
 * createTicket
 */
export const createTicket = asyncHandler(async (req, res) => {
  const { title, description, department, priority } = req.body;
  if (!title || !description || !department) throw new ApiError(400, "title, description, department required");

  const ticketId = await generateTicketId();
  const ticket = new Ticket({
    customer: req.user._id,
    title,
    description,
    department,
    priority: priority || "Low",
    ticketId
  });
  await ticket.save();

  if (global.__io) {
    global.__io.to("role:Agent").emit("newTicketCreated", { ticketId: ticket.ticketId, title: ticket.title, department: ticket.department, status: ticket.status, priority: ticket.priority });
    global.__io.to("role:Admin").emit("newTicketCreated", { ticketId: ticket.ticketId, title: ticket.title, department: ticket.department, status: ticket.status, priority: ticket.priority });
  }

  res.status(201).json(new ApiResponse(201, ticket, "Ticket created"));
});

/**
 * getTickets
 */
export const getTickets = asyncHandler(async (req, res) => {
  const { status, priority, department, sort = "-createdAt", page = 1, limit = 20 } = req.query;
  const q = {};

  if (req.user.role === "Customer") {
    q.customer = req.user._id;
  } else if (req.user.role === "Agent") {
    q.$or = [
      { assignedAgent: req.user._id },
      { assignedAgent: null, department: { $in: req.user.departments || [] } }
    ];
  }

  if (status) q.status = status;
  if (priority) q.priority = priority;
  if (department) q.department = department;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, parseInt(limit, 10));
  const tickets = await Ticket.find(q).sort(sort).skip(skip).limit(Math.min(100, parseInt(limit, 10))).populate("customer assignedAgent", "name email role");
  res.status(200).json(new ApiResponse(200, tickets, "Tickets fetched"));
});

/**
 * getTicketById
 *
 * --- MODIFIED FUNCTION ---
 * The logic here has been updated to correctly handle role-based permissions,
 * especially for Agents viewing tickets in their department.
 */
export const getTicketById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let ticket;

  // Find ticket by either its MongoDB _id or the custom sequential ticketId
  if (mongoose.Types.ObjectId.isValid(id)) {
    ticket = await Ticket.findById(id).populate("customer assignedAgent", "name email role");
  }
  if (!ticket) {
    ticket = await Ticket.findOne({ ticketId: id }).populate("customer assignedAgent", "name email role");
  }

  // If no ticket is found by either method, throw a 404 error.
  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  const user = req.user;
  let isAllowed = false;

  // Check permissions based on user role
  if (user.role === "Admin") {
    isAllowed = true;
  } else if (user.role === "Customer") {
    // A customer is allowed only if they are the owner of the ticket.
    isAllowed = ticket.customer._id.equals(user._id);
  } else if (user.role === "Agent") {
    // An agent is allowed if they are assigned to the ticket OR if the ticket
    // belongs to one of their departments. This allows them to view and claim tickets.
    const isAssigned = ticket.assignedAgent && ticket.assignedAgent._id.equals(user._id);
    const isInDepartment = user.departments && user.departments.includes(ticket.department);
    isAllowed = isAssigned || isInDepartment;
  }

  // If the user is not allowed, throw a 404 error for security.
  // This prevents non-privileged users from confirming the existence of a ticket.
  if (!isAllowed) {
    throw new ApiError(404, "Ticket not found or permission denied");
  }

  res.status(200).json(new ApiResponse(200, ticket, "Ticket fetched"));
});


/**
 * assignTicket
 */
export const assignTicket = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { agentId, status } = req.body;
  const ticket = await Ticket.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  if (agentId) ticket.assignedAgent = agentId;
  if (status) ticket.status = status;
  await ticket.save();

  if (global.__io) {
    global.__io.to(`ticket:${ticket._id}`).emit("ticketUpdated", { ticketId: ticket.ticketId, status: ticket.status, assignedAgent: ticket.assignedAgent });
  }

  res.status(200).json(new ApiResponse(200, ticket, "Ticket assigned/updated"));
});

/**
 * addChatMessage
 */
export const addChatMessage = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  if (!text) throw new ApiError(400, "text required");

  let ticket = await Ticket.findById(id);
  if (!ticket) ticket = await Ticket.findOne({ ticketId: id });
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const isParticipant = ticket.customer.equals(req.user._id) || (ticket.assignedAgent && ticket.assignedAgent.equals(req.user._id)) || req.user.role === "Admin";
  if (!isParticipant) throw new ApiError(403, "Forbidden");

  const message = { sender: req.user._id, text, timestamp: new Date() };
  ticket.chat.push(message);
  await ticket.save();

  const lastMsg = ticket.chat[ticket.chat.length - 1];

  if (global.__io) {
    global.__io.to(`ticket:${ticket._id}`).emit("newMessage", { ticketId: ticket.ticketId, message: lastMsg });
  }

  res.status(201).json(new ApiResponse(201, lastMsg, "Message added"));
});