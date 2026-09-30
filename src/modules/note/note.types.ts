import { Types } from "mongoose";

export interface CreateNoteData {
  title: string;
  content: string;
  owner: Types.ObjectId;
}

export interface UpdateNoteData {
  title?: string | undefined;
  content?: string | undefined;
}