import { User } from "../user/user.model";

export class AuthRepository {
    async existingUser(email: string) {
        const user = await User.findOne({ email });
        return user;
    }

    async createUser(data: { name: string; email: string; password: string }) {
        const user = await User.create(data);
        return user;
    }
}