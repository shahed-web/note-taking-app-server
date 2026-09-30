import type { Application } from "express";
import authRoutes from "./modules/auth/auth.routes"
import noteRoutes from "./modules/note/note.routes"
import userRoutes from "./modules/user/user.routes"
import adminRoutes from "./modules/admin/admin.routes"
import { AuthMiddleware } from "./middleware/auth.middleware";

const authMiddleware = new AuthMiddleware()
export default async (app: Application) => {

    // all routes starting point will be here
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/notes", [authMiddleware.authenticate, authMiddleware.authorizeRoles("admin", "user")], noteRoutes);
    
    
    
    app.use("/api/admin", [authMiddleware.authenticate, authMiddleware.authorizeRoles("admin")], adminRoutes);


    // test route
    app.use("/health", (_req, res) => {
        res.status(200).json({
            success: true,
            message: "Server is healthy",
        });
    });

}