import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
import progressRouter from "./routes/progress.routes.js";
import taskRoutes from "./routes/task.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import statsRoutes from "./routes/stats.routes.js";  
import goalsRoutes from "./routes/goals.routes.js"; 
import focusSessionRoutes from "./routes/focusSession.routes.js"; 

app.use("/api/v1/focus", focusSessionRoutes); 
app.use("/api/v1/goals", goalsRoutes);
app.use("/api/v1/stats", statsRoutes);  
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/pdf", pdfRouter);
                 


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
  });
});


export { app };
