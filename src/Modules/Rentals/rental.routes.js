import { Router } from "express";
import * as rentalController from "./rental.controller.js";



const router = Router() 
router.post('/create', rentalController.createRental)
router.get('/get/:id', rentalController.getRental)
router.get('/getall', rentalController.getAll)
router.put('/update', rentalController.updateRental)
router.delete('/delete/:id', rentalController.deleteRental)





export default router;