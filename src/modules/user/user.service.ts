import { hashPassword } from "../../utils/password";
import { UserRepository } from "./user.repository";
import { UpdateUserData } from "./user.types";
import { CreateUserInput, UpdateUserInput } from "./user.validation";

const repository = new UserRepository()

export class UserService {

    async createUser(data: CreateUserInput) {
        const hashedPassword = await hashPassword(data.password);

        return await repository.createUser({
            ...data,
            password: hashedPassword,
        });
    }

    async getAllUsers(page: number, limit: number) {
        return await repository.getAllUsers(page, limit)
    }

    async groupUserByInterest() {
        return await repository.groupUsersByInterests()
    }

    async getUserWithPost(userId: string) {
        const user = await repository.getUserWithPosts(userId)
        return user
    }

    async updateUser(userId: string, data: UpdateUserInput) {
        const updateData: UpdateUserData = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.email !== undefined) {
            updateData.email = data.email;
        }

        if (data.role !== undefined) {
            updateData.role = data.role;
        }

        if (data.interests !== undefined) {
            updateData.interests = data.interests;
        }

        if (data.password !== undefined) {
            updateData.password = await hashPassword(data.password);
        }

        return await repository.updateUser(userId, updateData);
    }

    async deleteUser(userId: string) {
        return await repository.deleteUser(userId);
    }
}