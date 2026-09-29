import { type Application, json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";


export default (app: Application) => {
    app.use(helmet());
    app.use(
        cors({
            origin: process.env.FRONTEND_URL,
            credentials: true,
        })
    );
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(cookieParser());
};    