 import { Router } from "express";
 import { UserController } from "../user/user.controller";
 
 const router = Router();
 const controller = new UserController();
 

 router.get("/user/", controller.getAllUserHandler);
 router.post("/user/", controller.createUserHandler);
 router.patch("/user/:id", controller.updateUserHandler);
 router.delete("/user/:id", controller.deleteUserHandler);

 
 export default router;