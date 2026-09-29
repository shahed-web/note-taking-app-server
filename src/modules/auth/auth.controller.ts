import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
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

    async login(req: Request, res: Response, next: NextFunction) {
        const validateData = loginSchema.parse(req.body);
        try{
            const result = await authService.loginUser(validateData);
            
            res.status(200).json({
              success: true,
              message: "Login successful",
              data: result,
            });
        }catch(error) {
            next(error);
        }
    }
}