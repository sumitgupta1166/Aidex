import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Ticket } from "../models/ticket.model.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",  // allow all origins
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  global.__io = io;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization || "").replace("Bearer ", "");
      if (!token) return next(new Error("Authentication error: token required"));
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(payload._id).select("-password");
      if (!user) return next(new Error("Authentication error: user not found"));
      socket.user = user;
      next();
    } catch (err) {
      console.error("Socket auth error:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    socket.join(`user:${user._id}`);
    socket.join(`role:${user.role}`);
    console.log(`Socket connected: ${user.email} (${socket.id})`);

    socket.on("joinTicketRoom", async ({ ticketId }) => {
      try {
        if (!ticketId) return socket.emit("error", { message: "ticketId required" });
        let ticket = null;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(ticketId);
        if (isObjectId) ticket = await Ticket.findById(ticketId);
        if (!ticket) ticket = await Ticket.findOne({ ticketId });
        if (!ticket) return socket.emit("error", { message: "Ticket not found" });

        const isParticipant = ticket.customer.equals(user._id) || (ticket.assignedAgent && ticket.assignedAgent.equals(user._id)) || user.role === "Admin";
        if (!isParticipant) return socket.emit("error", { message: "Not authorized for ticket" });

        socket.join(`ticket:${ticket._id}`);
        socket.emit("joinedTicketRoom", { ticketId: ticket.ticketId });
      } catch (err) {
        console.error("joinTicketRoom error", err);
        socket.emit("error", { message: "Could not join ticket room" });
      }
    });

    socket.on("leaveTicketRoom", ({ ticketId }) => {
      try {
        const roomName = `ticket:${ticketId}`;
        socket.leave(roomName);
        socket.emit("leftTicketRoom", { ticketId });
      } catch (err) {
        socket.emit("error", { message: "Could not leave ticket room" });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${user.email} (${socket.id}) reason: ${reason}`);
    });
  });

  return io;
};
