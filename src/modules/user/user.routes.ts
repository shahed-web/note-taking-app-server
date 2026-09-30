 import { Router } from "express";
 import { UserController } from "./user.controller";
 
 const router = Router();
 const controller = new UserController();
 
 router.get("/:id/posts", controller.getUserWithPostsHandler);

 
 export default router;