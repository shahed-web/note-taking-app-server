import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { USER_MESSAGES } from "../../constant/message";

const userService = new UserService()
export class UserController {
    async groupUserByInterestHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.groupUserByInterest()

            res.status(200).json({
                success: true,
                message: USER_MESSAGES.GROUP.SUCCESS,
                data: result
            })
        } catch(error) {
            next(error)
        }
    }
 }