import express from "express";
import middleware from "./middleware";
import routes from "./routes";
import { globalErrorHandler } from "./middleware/error.middleware";

export const app = express();

// Middleware
middleware(app);
// All routes
routes(app);
// Global error handler
app.use(globalErrorHandler);