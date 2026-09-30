import { User } from "./user.model";

export class UserRepository {
    async findUserById(userId: string) {
        const user = await User.findById(userId)
        return user
    }
}