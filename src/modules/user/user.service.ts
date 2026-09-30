import { UserRepository } from "./user.repository";

const repository = new UserRepository()
export class UserService {
    async groupUserByInterest() {
        return await repository.groupUsersByInterests()
    }

    async getUserWithPost(userId: string) {
        const user = await repository.getUserWithPosts(userId)
        return user
    }
}