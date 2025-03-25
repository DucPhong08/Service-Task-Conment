import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

import taskRoutes from "./routes/taskRoutes.js"
import subtaskRoutes from "./routes/subtaskRoutes.js"
import assignmentRoutes from "./routes/assignmentRoutes.js"
import errorHandling from "./middlewares/errorHandler.js"
import setupDatabase from "./data/createTaskTable.js"

const app = express()
const port = process.env.PORT || 3001

// Middlewares
app.use(express.json())
app.use(cors())


// Routes
app.use("/api/tasks", taskRoutes)
app.use("/api/subtasks", subtaskRoutes)
app.use("/api/ass", assignmentRoutes)




// Error handling Middleware
app.use(errorHandling)

// Create Table before starting server
setupDatabase()

// Sever running
app.listen(port, () => {
    console.log(`Sever http://localhost:${port}`);
    
})

