import { NextFunction, Request, Response } from "express";
import { registerSchema } from "./auth.validation";
import { AuthService } from "./auth.service";
import { AUTH_MESSAGES } from "../../constant/message";


const authService = new AuthService();
export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const validateData = registerSchema.parse(req.body);
            const user = await authService.registerUser(validateData);
            res.status(201).json({
                message: AUTH_MESSAGES.REGISTER.SUCCESS,
                user,
            });
        } catch (error) {
            next(error);
        }
    }
}