import dotenv from "dotenv"
dotenv.config()

import http from "http"
import { app } from "./app.js"
import { connectDB } from "./db/index.js"
import { initSocket } from "./sockets/socketHandler.js"

const port = process.env.PORT || 8000
const httpServer = http.createServer(app)

;(async () => {
  try {
    await connectDB()
    initSocket(httpServer)

    httpServer.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    )
  } catch (err) {
    console.error("❌ Failed to start server", err)
    process.exit(1)
  }
})()
