import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { USER_MESSAGES } from "../../constant/message";
import { paginationSchema } from "./user.validation";

const userService = new UserService()
export class UserController {
    async getAllUserHandler(req: Request, res: Response, next: NextFunction) {
        try{
            const { page, limit } = paginationSchema.parse(req.query);

            const result = await userService.getAllUsers(page, limit);

            res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                data: result.users,
                pagination: result.pagination,
            });
        } catch(error) {
            next(error)
        }
    }

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

    async getUserWithPostsHandler(req: Request<{id: string}, {}, {}>, res: Response, next: NextFunction) {
        try {
            const user = await userService.getUserWithPost(req.params.id)
   
            res.status(200).json({
                success: true,
                message: USER_MESSAGES.POST.SUCCESS,
                data: user
            })
        } catch(error) {
            next(error)
        }
    }
 }