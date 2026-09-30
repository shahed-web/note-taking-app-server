import { NextFunction, Request, Response } from "express";
import { NoteService } from "./note.service";
import { createNoteSchema, paginationSchema, updateNoteSchema } from "./note.validation";
import { NOTE_MESSAGES } from "../../constant/message";

const noteService = new NoteService();
export class NoteController {
    async createNoteHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const validateData = createNoteSchema.parse(req.body)

            const note = await noteService.createNote({title: validateData.title, content: validateData.content, owner: req.user._id});

            res.status(201).json({
                success: true,
                message: NOTE_MESSAGES.CREATE.SUCCESS,
                data: note
            })
        }catch(error) {
            next(error)
        }
    }

    async getAllNotesByUserHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit } = paginationSchema.parse(req.query);
            const {notes, pagination} = await noteService.getUserNotes(req.user._id, page, limit);

            res.status(200).json({
                success: true,
                message: NOTE_MESSAGES.GET.SUCCESS,
                data: notes,
                pagination
            })
        }catch(error) {
            next(error)
        }
    }

    async getAllNotesHandler(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { page, limit } = paginationSchema.parse(req.query);

            const result = await noteService.getAllNotes(page, limit);

            res.status(200).json({
                success: true,
                message: NOTE_MESSAGES.GET.SUCCESS,
                data: result.notes,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    }
    async getNoteByIdHandler(req: Request<{id: string}, {}, {}>, res: Response, next: NextFunction) {
        try {
            const note = await noteService.getNoteById(req.params.id, req.user._id)

            if(!note) {
                return res.status(404).json({
                    success: false,
                    message: NOTE_MESSAGES.GET.NOT_FOUND
                })
            }

            res.status(200).json({
                success:true,
                message: NOTE_MESSAGES.GET.SUCCESS,
                data: note
            })
        }catch(error) {
            next(error)
        }
    }

    async updateNoteHandler (req: Request<{id: string}, {}, {}>, res: Response, next: NextFunction) {
        try {
            const validateData = updateNoteSchema.parse(req.body)

            const note = await noteService.updateNote(req.params.id, req.user._id, validateData)

            if(!note) {
                return res.status(404).json({
                    success: false,
                    message: NOTE_MESSAGES.GET.NOT_FOUND
                })
            }

            res.status(200).json({
                success: true,
                message: NOTE_MESSAGES.UPDATE.SUCCESS,
                data: note
            })
        } catch(error) {
            next(error)
        }
    }

    async deleteNoteHandler (req: Request<{id: string}, {}, {}>, res: Response, next: NextFunction) {
        try {
            const note = await noteService.deleteNote(req.params.id, req.user._id)
            if(!note) {
                return res.status(404).json({
                    success: false,
                    message: NOTE_MESSAGES.GET.NOT_FOUND
                })
            }

            res.status(200).json({
                success: true,
                message: NOTE_MESSAGES.DELETE.SUCCESS
            })
        }catch( error) {
            next(error)
        }
    }
}