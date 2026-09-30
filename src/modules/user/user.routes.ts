 import { Router } from "express";
 import { UserController } from "./user.controller";
 
 const router = Router();
 const controller = new UserController();
 

//  before id or dynamic params
 router.get("/interests/grouped", controller.groupUserByInterestHandler);

 
 export default router;