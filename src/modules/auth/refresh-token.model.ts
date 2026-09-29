import { Document, model, Schema, Types } from "mongoose";

export interface IRefreshToken extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.index({ user: 1 });

refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);