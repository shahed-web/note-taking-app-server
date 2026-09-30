 import { Router } from "express";
 import { UserController } from "../user/user.controller";
import { NoteController } from "../note/note.controller";
 
 const router = Router();
 const userController = new UserController();
 const noteController = new NoteController()
 

 router.get("/users/", userController.getAllUserHandler);
 router.get("/users/interests/grouped", userController.groupUserByInterestHandler);
 router.post("/users/", userController.createUserHandler);
 router.patch("/users/:id", userController.updateUserHandler);
 router.delete("/users/:id", userController.deleteUserHandler);
 
 router.get("/notes/", noteController.getAllNotesHandler);
 
 export default router;