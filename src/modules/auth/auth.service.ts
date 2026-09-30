import { AUTH_MESSAGES } from "../../constant/message";
import { AlreadyExistsError, UnauthorizedError } from "../../utils/app-error";
import { generateAccessToken, generateRefreshToken, hashToken, verifyRefreshToken } from "../../utils/jwt";
import { hashPassword, validatePassword } from "../../utils/password";
import { AuthRepository } from "./auth.repository";
import { RefreshTokenPayload } from "./auth.types";
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
        const tokenHash = hashToken(refreshToken);

        const expirationInSeconds = parseInt(
            process.env.DB_TOKEN_EXPIRATION_IN_SECONDS || "604800000",
            10
        );

        const expiresAt = new Date(
            Date.now() + expirationInSeconds * 1000
        );

        await repository.createRefreshToken(
            tokenHash, 
            user._id.toString(), 
            expiresAt
        );
        
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

    async logout(refreshToken: string) {
        const tokenHash = hashToken(refreshToken);
        await repository.deleteByTokenHash(tokenHash);
    }

    async refreshAccessToken(refreshToken: string) {
        const payload = verifyRefreshToken<RefreshTokenPayload>(refreshToken);
        const tokenHash = hashToken(refreshToken);
        const storedToken = await repository.storedRefreshToken(tokenHash, payload.sub);

        if (!storedToken) {
            throw new UnauthorizedError(AUTH_MESSAGES.AUTHORIZE.EXPIRED);
        }

        if (storedToken!.expiresAt.getTime() <= Date.now()) {
            await repository.deleteRefreshToken(storedToken!._id.toString());

            throw new UnauthorizedError(AUTH_MESSAGES.AUTHORIZE.EXPIRED);
        }

        const accessToken = generateAccessToken({ sub: payload.sub, role: payload.role });

        return accessToken;
    }
}