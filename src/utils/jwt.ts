import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayload } from "../modules/auth/auth.types";
import crypto from "node:crypto"

type TokenType = "access" | "refresh";


const getSecret = (type: TokenType): string => {
  const secret =
    type === "access"
      ? process.env.JWT_ACCESS_SECRET
      : process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error(`JWT ${type} secret is not configured`);
  }

  return secret;
};

const getExpiresIn = (
  type: TokenType,
): NonNullable<SignOptions["expiresIn"]> => {
  const expiresIn =
    type === "access"
      ? process.env.JWT_ACCESS_EXPIRES_IN
      : process.env.JWT_REFRESH_EXPIRES_IN;

  if (!expiresIn) {
    throw new Error(`JWT ${type} expiration is not configured`);
  }

  return expiresIn as NonNullable<SignOptions["expiresIn"]>;
};

export const generateToken = (
  payload: TokenPayload,
  type: TokenType,
): string => {
  return jwt.sign(payload, getSecret(type), {
    expiresIn: getExpiresIn(type),
  });
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return generateToken(payload, "access");
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return generateToken(payload, "refresh");
};

export const verifyToken = <T extends object>(
  token: string,
  type: TokenType,
): T => {
  return jwt.verify(token, getSecret(type)) as T;
};

export const verifyAccessToken = <T extends object>(token: string): T => {
  return verifyToken<T>(token, "access");
};

export const verifyRefreshToken = <T extends object>(token: string): T => {
  return verifyToken<T>(token, "refresh");
};

export const hashToken = (token: string): string => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};