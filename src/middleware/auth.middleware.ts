import { NextFunction, Request, Response } from "express";
import { AUTH_MESSAGES, USER_MESSAGES } from "../constant/message";
import { ForbiddenError, UnauthorizedError } from "../utils/app-error";
import { verifyAccessToken } from "../utils/jwt";
import { TokenPayload } from "../modules/auth/auth.types";
import { UserRepository } from "../modules/user/user.repository";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const repository = new UserRepository()
export class AuthMiddleware {
    async authenticate(req: Request, res: Response, next: NextFunction) {
        
        try {
            const authorization = req.headers.authorization
            if(!authorization || !authorization.startsWith("Bearer ")) {
                throw new UnauthorizedError(AUTH_MESSAGES.AUTHORIZE.AUTH_REQUIRED)
            }

            const token = authorization.split(" ")[1];
            if (!token) {
                throw new UnauthorizedError(AUTH_MESSAGES.AUTHORIZE.AUTH_REQUIRED)
            }

            const payload = verifyAccessToken<TokenPayload>(token)

            const user = await repository.findUserById(payload.sub)

            if(!user) {
                throw new UnauthorizedError(USER_MESSAGES.GET.NOT_FOUND)
            }

            req.user = {
                _id: user._id,
                role: user.role,
            };
            next();
        } catch(error) {
                if (error instanceof TokenExpiredError) {
                next(
                    new UnauthorizedError(
                        AUTH_MESSAGES.AUTHORIZE.EXPIRED
                    )
                );
                return;
                }

                if (error instanceof JsonWebTokenError) {
                next(
                    new UnauthorizedError(
                    AUTH_MESSAGES.AUTHORIZE.AUTH_REQUIRED
                    )
                );
                return;
                }
            next(error)
        }
    }

    authorizeRoles(...allowedRoles: string[]) {
        return (req: Request, res: Response, next: NextFunction):void => {
            if(!allowedRoles.includes(req.user.role)) {
                return next(
                    new ForbiddenError()
                )
            }
            next()
        }
    }


}