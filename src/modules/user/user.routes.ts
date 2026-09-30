 import { Router } from "express";
 import { UserController } from "./user.controller";
 
 const router = Router();
 const controller = new UserController();
 

 router.get("/", controller.getAllUserHandler);
 router.get("/interests/grouped", controller.groupUserByInterestHandler);
 router.get("/:id/posts", controller.getUserWithPostsHandler);

 
 export default router;