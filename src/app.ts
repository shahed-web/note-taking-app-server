import express from "express";
import middleware from "./middleware";
import routes from "./routes";

const app = express();

// Middleware
middleware(app);
// All routes
routes(app);

export default app;