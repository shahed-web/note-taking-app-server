import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { USER_MESSAGES } from "../../constant/message";
import { createUserSchema, paginationSchema, updateUserSchema } from "./user.validation";

const userService = new UserService()
export class UserController {

    async createUserHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const data = createUserSchema.parse(req.body);

            const user = await userService.createUser(data);

            res.status(201).json({
                success: true,
                message: USER_MESSAGES.CREATE.SUCCESS,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

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

    async updateUserHandler(
        req: Request<{ id: string }, {}, {}>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const data = updateUserSchema.parse(req.body);

            const user = await userService.updateUser(
                req.params.id,
                data
            );

            if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
            }

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUserHandler(
        req: Request<{ id: string }, {}, {}>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await userService.deleteUser(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: USER_MESSAGES.GET.NOT_FOUND,
                });
            }

            res.status(200).json({
                success: true,
                message: USER_MESSAGES.DELETE.SUCCESS,
            });
        } catch (error) {
            next(error);
        }
    }
 }