import { Types } from "mongoose";
import { Note } from "./note.model";
import { CreateNoteData, UpdateNoteData } from "./note.types";

export class NoteRepository {
    async createNote(data: CreateNoteData) {
        return await Note.create(data);
    }

    async getUserNotes(owner: Types.ObjectId) {
      return await Note.find({ owner }).sort({ createdAt: -1 });
    };
    
    async getNoteById(noteId: string, owner: Types.ObjectId) {
      return await Note.findOne({ _id: noteId, owner });
    }
    
    async updateNote(
      noteId: string,
      owner: Types.ObjectId,
      data: UpdateNoteData
    ) {
        const note = await Note.findOneAndUpdate(
            {
                _id: noteId,
                owner,
            },
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
            }
        );

    return note;
    }

    async deleteNote(noteId: string, owner: Types.ObjectId) {
          const note = await Note.findOneAndDelete({
                _id: noteId,
                owner,
            });
      return note; 
    }

}   