import { ObjectId} from 'mongodb'
import Car from '../../../DB/Models/car.model.js'
import  $Set  from '../../utils/manageSetOperator.util.js'
import { HondaAndToyotaValidation, carValidation } from '../../utils/regexValidation.util.js'




//add car
export const addCar = async (req, res)=>{
    try {
        let {name, model, rentalStatus} = req.body
        if(!name || !model || !rentalStatus){
            return res.status(400).json({message: "name, model and rental status are required"})
        }

        rentalStatus = rentalStatus.toLowerCase()

        //validation 
        if(carValidation(name, model, rentalStatus) !== true){
            return res.status(400).json(carValidation(name, model, rentalStatus))
        }

        name = name.toLowerCase()

        const car = await Car.insertOne({name, model , rentalStatus})

        return res.status(201).json({message: "Car added successfully", car})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}





//get car
export const getCar = async (req, res)=>{
    try {
        const {id} = req.params
        if(!ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid id format"})
        }

        const car = await Car.findOne({_id: ObjectId.createFromHexString(id)},
        {projection: {_id: 0}})

        if(!car){
            return res.status(404).json({message: "Car not found"})
        }

        return res.status(200).json({message: "Car found", car})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}






//get all cars
export const getAll = async (req, res)=>{
    try {
        const cars = await Car.find({}, {projection: {_id: 0}}).toArray()

        if(cars.length === 0){
            return res.status(404).json({message: "Cars not found"})
        }

        return res.status(200).json({message: "Cars are found", cars})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}






//update a car
export const updateCar = async (req, res)=>{
    try {
        const {id} = req.params
        if(ObjectId.isValid(id) === false){
            return res.status(400).json({message: "Invalid id format"}) 
        }


        let {name, model, rentalStatus} = req.body
        if(!name && !model && !rentalStatus){
            return res.status(400).json({message:"at least one field is required"})
        }


        rentalStatus? rentalStatus = rentalStatus.toLowerCase():''
        //validation 
        if(carValidation(name, model, rentalStatus) !== true){
            return res.status(400).json(carValidation(name, model, rentalStatus))
        }


        name? name = name.toLowerCase():''

        const updatedCar = await Car.findOneAndUpdate(
            {_id: ObjectId.createFromHexString(id)},
            {$set: $Set({name, model, rentalStatus})},
            {returnDocument: "after", projection: {_id:0}},
            
        )


        if(!updatedCar){
            return res.status(404).json({message: "Car not found"})
        }
        

        return res.status(200).json({message: "Car updated successfully", updatedCar})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}







//delete a car
export const deleteCar = async (req, res)=>{
    try {

        const {id} = req.params

        if(ObjectId.isValid(id) === false){
            return res.status(400).json({message: "Invalid id format"})
        }

        const deletedCar = await Car.findOneAndDelete(
            {_id: ObjectId.createFromHexString(id)}  
        )


        if(!deletedCar){
            return res.status(404).json({message: "Car not found"})
        }
        
        return res.status(200).json({message: "Car deleted successfully"})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}








/*
    Special APIs
*/



//1- Get all cars whose brand is 'Honda' and 'Toyota' (using query params)
export const getHondaAndToyotaCars = async (req, res)=>{
    try {
        let {brand1, brand2} = req.query
        if(!brand1 || !brand2){
            return res.status(400).json({message: "Car brands are required"})
        }
      

        brand1 = brand1.toLowerCase()
        if(HondaAndToyotaValidation(brand1) !== true){
            return res.status(400).json(HondaAndToyotaValidation(brand1))
        }


        brand2 = brand2.toLowerCase()
        if(HondaAndToyotaValidation(brand2) !== true){
            return res.status(400).json(HondaAndToyotaValidation(brand2))
        }


        const cars = await Car.aggregate(
            [
                {
                    $match:{
                        name: { $in: [brand1, brand2]     }
                    }
                }
                ,
                {
                    $sort:{
                        name: 1
                    }
                },
                {
                    $project:{
                        _id: 0
                    }
                }
                
            ]
        ).toArray()
        
        if(cars.length === 0){
            return res.status(404).json({message: "Cars not found"})
        }
        
        return res.status(200).json({message: "Cars are found", cars})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}





//2- Get Available Cars of a Specific Brand
export const getAvailableCars = async (req, res)=>{
    try {
        let {brand} = req.params
        brand = brand.toLowerCase()


        const cars = await Car.find(
            {$and: [{name: brand}, {rentalStatus: "available"}]},
            {projection: {_id: 0}}
        ).toArray() 



        if(cars.length === 0){
            return res.status(404).json({message: "Cars not found"})
        }
        

        return res.status(200).json({message: "Cars are found", cars})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}
   




//3- Get Cars that are Either rented or of a Specific Brand
export const getRentedCarsORSpecificBrandCars = async (req, res)=>{
    try {

        let {brand} = req.query
        if(!brand){
            return res.status(400).json({message: "Car brand is required"})
        }
        brand = brand.toLowerCase()


        const cars = await Car.aggregate(
            [
                {
                    $match:{
                        $or: [{name: brand}, {rentalStatus: "rented"}]
                    }
                },

                {
                    $sort:{
                        name: 1
                    }
                },

                {$project: {_id: 0}}
            ]
            
        ).toArray() 


        if(cars.length === 0){
            return res.status(404).json({message: "Cars not found"})
        }
        

        return res.status(200).json({message: "Cars are found", cars})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}
   





//4- Get Available Cars of a Specific Brand or Rented Cars of a Specific Brand
export const getRentedCarsORAvailableCars = async (req, res)=>{
    try {
        let {brand} = req.params
        brand = brand.toLowerCase()
        const cars = await Car.aggregate(
            [
                {
                    $match:{
                        $and: [
                            {name:brand}, 
                            {rentalStatus: {$in: ["rented", "available"]}}
                        ]
                    }
                },

                {  
                    $sort:{
                        name: 1
                    }
                },

                {$project: {_id: 0}}
            ]
            
        ).toArray() 


        if(cars.length === 0){
            return res.status(404).json({message: "Cars not found"})
        }
        

        return res.status(200).json({message: "Cars are found", cars})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}