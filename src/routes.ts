import type { Application } from "express";

export default async (app: Application) => {

    // all routes starting point will be here

    
    app.use("/health", (_req, res) => {
        res.status(200).json({
            success: true,
            message: "Server is healthy",
        });
    });

}