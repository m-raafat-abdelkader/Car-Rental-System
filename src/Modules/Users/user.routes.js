import { Router } from "express";
import * as userController from "./user.controller.js";



const router = Router() 

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.get('/get/:id', userController.getUser)
router.get('/getall', userController.getAll)
router.put('/update/:id', userController.updateUser)
router.delete('/delete/:id', userController.deleteUser)




export default router;