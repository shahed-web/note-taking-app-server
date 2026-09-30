import { Router } from "express";
import { NoteController } from "./note.controller";

const router = Router();
const controller = new NoteController();

router.post("/", controller.createNoteHandler);
router.get("/", controller.getAllNotesByUserHandler);
router.get("/:id", controller.getNoteByIdHandler);
router.patch("/:id", controller.updateNoteHandler);
router.delete("/:id", controller.deleteNoteHandler);

export default router;