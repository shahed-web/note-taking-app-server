import { AUTH_MESSAGES } from "../../constant/message";
import { AlreadyExistsError, UnauthorizedError } from "../../utils/app-error";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { hashPassword, validatePassword } from "../../utils/password";
import { AuthRepository } from "./auth.repository";
import { LoginInput, RegisterInput } from "./auth.validation";

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

    async loginUser(data: LoginInput) {
        const user = await repository.existingUserWithPassword(data.email);
        if (!user) {
            throw new UnauthorizedError(AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await validatePassword(data.password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedError(AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS);
        }
        const tokenPayload = {
            sub: user._id.toString(),
            role: user.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}