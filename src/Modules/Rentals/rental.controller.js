import { ObjectId} from 'mongodb'
import Rental from '../../../DB/Models/rental.model.js'
import  $Set  from '../../utils/manageSetOperator.util.js'
import {isValidDate, createDate} from '../../utils/manageDates.util.js'
import Car from '../../../DB/Models/car.model.js'
import User from '../../../DB/Models/user.model.js'





//Create Rental
export const createRental = async (req, res) => {
    try {
        let {user_id, car_id, rentalDate, returnDate} = req.body

        if(!ObjectId.isValid(user_id) || !ObjectId.isValid(car_id)){
            return res.status(400).json({message: "Please provide valid user_id and car_id"})
        }

        user_id = ObjectId.createFromHexString(user_id)
        car_id = ObjectId.createFromHexString(car_id)

        const isUserExist = await User.findOne({_id: user_id})
        const isCarExist = await Car.findOne({_id: car_id})

        if(!isUserExist || !isCarExist){
            return res.status(400).json({message: "User or Car does not exist"})
        }

        if(!rentalDate || !returnDate){
            return res.status(400).json({message: "Please provide rentalDate and returnDate fields"})
        }

        const currentDate = new Date()
        currentDate.setHours(currentDate.getHours() + 3)


        const isCarRented = await Rental.findOne({ $and: [{car_id}, {returnDate: {$gt: currentDate} }] })
        if(isCarRented){
            return res.status(400).json({message: "This car is already rented"})
        }



        await Rental.findOneAndDelete({car_id})

        if(!isValidDate(rentalDate) || !isValidDate(returnDate)){
            return res.status(400).json({message: "Please ensure that you enter the dates in format YYYY/MM/DD like: 2024/05/01"})
        }
        
        rentalDate = createDate(rentalDate)
        returnDate = createDate(returnDate)
        if(rentalDate >= returnDate || currentDate >= returnDate){
            return res.status(400).json({message: "Return date must be later than both the rental date and the current date"})
        }



        await Car.findOneAndUpdate({_id: car_id}, {$set: {rentalStatus:"rented"}})

        const rental = await Rental.insertOne({
            user_id, 
            car_id, 
            rentalDate, 
            returnDate
        })


        return res.status(201).json({message: "Rental created successfully", rental})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}






//Get a Specific Rental
export const getRental = async (req, res) => {
    try {
        const {id} = req.params
        if(!ObjectId.isValid(id)){
            return res.status(400).json({message: "Please provide a valid id"})
        }
        const rental = await Rental.findOne(
            {_id: ObjectId.createFromHexString(id)},
            {projection: {_id:0}}
        )

        if(!rental){
            return res.status(404).json({message: "Rental not found"})
        }

        return res.status(200).json({message: "Rental found successfully", rental})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}







//Get All Rentals
export const getAll = async (req, res) => {
    try {

        const rentals = await Rental.find(
            {},
            {projection: {_id:0}}
        ).toArray()

        if(rentals.length == 0){
            return res.status(404).json({message: "Rentals are not found"})
        }

        return res.status(200).json({message: "Rentals are found successfully", rentals})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}








//Update Rental
export const updateRental = async (req, res) => {
    try {

        let {user_id, rental_id} = req.query
        if(!ObjectId.isValid(user_id) || !ObjectId.isValid(rental_id)){
            return res.status(400).json({message: "Please provide valid user_id and car_id"})
        }

        user_id = ObjectId.createFromHexString(user_id)
        rental_id = ObjectId.createFromHexString(rental_id)

    
        let {car_id, rentalDate, returnDate} = req.body
        if(!car_id && !rentalDate && !returnDate){
            return res.status(400).json({message: "Please provide at least one field to update"})
        }



        if(rentalDate){
            if(!isValidDate(rentalDate)){
                return res.status(400).json({message: "Please ensure that you enter the dates in format YYYY/MM/DD like: 2024/05/01"})
            }
            rentalDate = createDate(rentalDate)
        }



        let currentDate;
        if(returnDate){
            if(!isValidDate(returnDate)){
                return res.status(400).json({message: "Please ensure that you enter the dates in format YYYY/MM/DD like: 2024/05/01"})
            }
            returnDate = createDate(returnDate)
            currentDate = new Date()
            currentDate.setHours(currentDate.getHours() + 3)
        }
        
        
        if(rentalDate >= returnDate || currentDate >= returnDate){
            return res.status(400).json({message: "Return date must be later than both the rental date and the current date"})
        }   
            
        
        if(car_id){
            if(!ObjectId.isValid(car_id)){
                return res.status(400).json({message: "Please provide a valid car_id"})
    
            }
            car_id = ObjectId.createFromHexString(car_id)
            const isCarExist = await Car.findOne({_id: car_id})
            if(!isCarExist){
                return res.status(400).json({message: "Car with this id does not exist"})
            }
        }
        
       

        const updatedRental = await Rental.findOneAndUpdate(
            {_id: rental_id, user_id},
            {$set: $Set({car_id, rentalDate, returnDate})},
            {returnDocument: "after", projection: {_id: 0}}
        )


        if(!updatedRental){
            return res.status(404).json({message: "Rental not found"})
        }

        return res.status(200).json({message: "Rental updated successfully", updatedRental})


    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    } 
}









//Delete Rental
export const deleteRental = async (req, res) => {
    try {
        
        let {id} = req.params
        if(!ObjectId.isValid(id)){
            return res.status(400).json({message: "Please provide a valid rental_id"})
        }

        id = ObjectId.createFromHexString(id)

       
        const deletedRental = await Rental.findOneAndDelete({_id: id})

        if(!deletedRental){
            return res.status(404).json({message: "Rental not found"})
        }

        return res.status(200).json({message: "Rental deleted successfully "})


    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    } 
}