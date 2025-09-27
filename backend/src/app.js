import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"

import authRoutes from "./routes/auth.routes.js"
import ticketRoutes from "./routes/ticket.routes.js"
import kbRoutes from "./routes/kb.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "https://aidex-ruby.vercel.app"
]

app.use(helmet())
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)
app.use(express.json({ limit: "256kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// mount routes
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/kb", kbRoutes)
app.use("/api/users", userRoutes)

// health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }))
app.get("/", (req, res) => res.send({ service: "Aidex Backend" }))

export { app }
