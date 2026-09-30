import { Types } from "mongoose";
import { NoteRepository } from "./note.repository";
import { CreateNoteData, UpdateNoteData } from "./note.types";

const repository = new NoteRepository();
export class NoteService {
    async createNote(data: CreateNoteData) {
        const note = await repository.createNote(data);
        return note;
    }
    
    async getUserNotes(owner: Types.ObjectId) {
        const notes = await repository.getUserNotes(owner);
        return notes;
    }

    async getNoteById(noteId: string, owner: Types.ObjectId) {
        const note = await repository.getNoteById(noteId, owner);
        return note;
    }

    async updateNote(noteId: string, owner: Types.ObjectId, data: UpdateNoteData) {
        const note = await repository.updateNote(noteId, owner, data);
        return note;
    }

    async deleteNote(noteId: string, owner: Types.ObjectId) {
        const deletedNote = await repository.deleteNote(noteId, owner);
        return deletedNote;
    }
}

