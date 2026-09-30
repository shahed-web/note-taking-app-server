import { User } from "../user/user.model";
import { RefreshToken } from "./refresh-token.model";

export class AuthRepository {
    async existingUser(email: string) {
        const user = await User.findOne({ email });
        return user;
    }

    async existingUserWithPassword(email: string) {
        const user = await User.findOne({ email }).select("+password");
        return user;
    }

    async existingUserById(userId: string) {
      return await User.findById(userId);
    }

    async createUser(data: { name: string; email: string; password: string }) {
        const user = await User.create(data);
        return user;
    }

    async createRefreshToken(tokenHash: string, userId: string, expiresAt: Date) {
        return await RefreshToken.create({ tokenHash, user: userId, expiresAt });
        
    }
    async storedRefreshToken(tokenHash: string, userId: string) {
        return await RefreshToken.findOne({ tokenHash, user: userId });
    }

    async deleteRefreshToken(tokenId: string) {
        return await RefreshToken.deleteOne({ _id: tokenId });
    }

    async deleteByTokenHash(tokenHash: string) {
     return await RefreshToken.deleteOne({ tokenHash });
    }
}