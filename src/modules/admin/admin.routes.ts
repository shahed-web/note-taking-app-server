 import { Router } from "express";
 import { UserController } from "../user/user.controller";
 
 const router = Router();
 const controller = new UserController();
 

 router.get("/", controller.getAllUserHandler);

 
 export default router;