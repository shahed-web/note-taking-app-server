import { AUTH_MESSAGES } from "../../constant/message";
import { AlreadyExistsError } from "../../utils/app-error";
import { hashPassword } from "../../utils/password";
import { AuthRepository } from "./auth.repository";
import { RegisterInput } from "./auth.validation";

const repository = new AuthRepository();
export class AuthService {
    async registerUser(data: RegisterInput) {
        const { name, email, password } = data;
        const existingUser = await repository.existingUser(email);

        if (existingUser) {
            throw new AlreadyExistsError(AUTH_MESSAGES.REGISTER.EXISTS);
        }

        const hashedPassword = await hashPassword(password);

        const user = await repository.createUser({
            name,
            email,
            password: hashedPassword,
        });
        
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}