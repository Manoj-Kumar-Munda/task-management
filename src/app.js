import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("/public"));
app.use(cookieParser());
app.use(express.json());
//router imports
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);

app.use((err, req, res, next) => {
  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";
  const errorCode = err?.code ?? "";
  const errors = err?.errors ?? [];
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errorCode,
    errors,
  });
});

export default app;
