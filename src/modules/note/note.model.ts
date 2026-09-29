import { Document, model, Schema, Types } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
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

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ owner: 1 });

export const Note = model<INote>("Note", noteSchema);