import express from "express";

const app = express();

//router imports
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/auth.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);

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
