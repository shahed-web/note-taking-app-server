import { UserRepository } from "./user.repository";

const repository = new UserRepository()
export class UserService {
    async groupUserByInterest() {
        return await repository.groupUsersByInterests()
    }
}