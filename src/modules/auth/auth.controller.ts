import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { AuthService } from "./auth.service";
import { AUTH_MESSAGES } from "../../constant/message";
import { UnauthorizedError } from "../../utils/app-error";


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
            const {accessToken, refreshToken, user} = await authService.loginUser(validateData);
            
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 60 * 1000,
            });
            
            res.status(200).json({
              success: true,
              message: AUTH_MESSAGES.LOGIN.SUCCESS,
              data: { accessToken, user },
            });
        }catch(error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken) {
                throw new UnauthorizedError(AUTH_MESSAGES.AUTHORIZE.INVALID_SESSION);
            }
            const accessToken = await authService.refreshAccessToken(refreshToken);
            res.status(200).json({
                success: true,
                message: AUTH_MESSAGES.AUTHORIZE.SUCCESS,
                data: { accessToken },
            });
        } catch (error) {
            next(error);
        }
    }
}