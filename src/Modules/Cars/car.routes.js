import { Router } from "express";
import * as carController from "./car.controller.js";

const router = Router() 
router.post('/add', carController.addCar)
router.get('/get/:id', carController.getCar)
router.get('/getall', carController.getAll)
router.put('/update/:id', carController.updateCar)
router.delete('/delete/:id', carController.deleteCar)


//special endpoints
router.get('/getHondaAndToyotaCars', carController.getHondaAndToyotaCars)
router.get('/getAvailableCars/:brand', carController.getAvailableCars)
router.get('/getRentedCarsORSpecificBrandCars', carController.getRentedCarsORSpecificBrandCars)
router.get('/getRentedCarsORAvailableCars/:brand', carController.getRentedCarsORAvailableCars)





export default router;