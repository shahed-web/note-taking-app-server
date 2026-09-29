import { Document, model, Schema, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ author: 1 });

export const Post = model<IPost>("Post", postSchema);