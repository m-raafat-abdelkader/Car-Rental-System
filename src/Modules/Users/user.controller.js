import { ObjectId} from 'mongodb'
import User from '../../../DB/Models/user.model.js'
import { hashSync, compareSync } from 'bcrypt'
import $Set from '../../utils/manageSetOperator.util.js'
import {userValidation} from '../../utils/regexValidation.util.js'
import validator from 'validator'



//create index
User.createIndex({email: 1}, {unique: true, name:"emailIndex"})




//Signup 
export const signup = async (req, res)=>{
    try {
        const {name, email, password, phone} = req.body
        if(!name || !email || !password || !phone){
            return res.status(400).json({message:"name, email, password and phone are required"})
        }

        
        //validation
        if(userValidation(name, email, password, phone) !== true){
            return res.status(400).json(userValidation(name, email, password, phone))
        }
        

        const isEmailExist = await User.findOne({email: email.toLowerCase()})
        if(isEmailExist){
            return res.status(409).json({message: "Email already exists"})
        }

        const hash = hashSync(password, 10)

        const newUser = await User.insertOne({name, email: email.toLowerCase(), password:hash, phone})

        return res.status(201).json({message:"User created successfully", data: newUser})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})

    }
}






//Signin
export const signin = async (req,res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({message: "You must provide your email along with your password"})
        }

        if(!validator.isEmail(email + '')){
            return res.status(400).json({message: "email must be a valid email address"})
        }


        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message: "Invalid credntials"})
        }


        const isMatch = compareSync(password + '', user.password)
        if(!isMatch){
            return res.status(401).json({message: "Invalid credntials"})
        }


        const login = await User.updateOne(
            {$and:[ {email}, {lastLogin: {$exists: false} }]},
            {$set: {lastLogin: new Date()}}
        )


        if(!login.modifiedCount){
            return res.status(409).json({message: "You are Already logged in"})
        }


        return res.status(200).json({message: "User logged in successfully"})
    
    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}





// get a specific user 
export const getUser = async (req, res)=>{
    try {
        const {id} = req.params
        if(!ObjectId.isValid(id)){
            return res.status(400).json({message: "You must provide a valid id"})
        }


        const user = await User.findOne({_id: ObjectId.createFromHexString(id)})
        if(!user){
            return res.status(404).json({message: "User not found"})
        }


        return res.status(200).json({message: "User found", data: user})


    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}






//get all users
export const getAll = async (req,res)=>{
    try {
        const users = await User.find(
            {},
            {projection: {password:0, lastLogin:0, _id:0}}
        ).toArray()



        if(users.length === 0){
            return res.status(404).json({message: "Users not found"})
        }


        return res.status(200).json({message: "Users found", data: users})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}







//update user
export const updateUser = async(req,res)=>{
    try {
        let {id} = req.params
        if(ObjectId.isValid(id) === false){
            return res.status(400).json({message: "Please provide a valid id"})
        }

        id = ObjectId.createFromHexString(id)

        const SignedIn = await User.findOne({
            $and:
            [
                {_id: id},
                {lastLogin: {$exists: true}}
            ]
        })

        if(!SignedIn){
            return res.status(401).json({message: "unauthorized access"})
        }


        const {name, email, phone} = req.body
        let {password} = req.body

        if(!name && !email && !password && !phone){
            return res.status(400).json({message:"at least one field is required to update the user"})
        }


        //validation
        if(userValidation(name, email, password, phone) !== true){
            return res.status(400).json(userValidation(name, email, password, phone))
        }

        const isEmailExist = await User.findOne({email})
        if(isEmailExist){
            return res.status(409).json({message: "Email is already in use"})
        }

        if(password){password = hashSync(password, 10)}

        const updatedUser = await User.updateOne(
            {_id: id},
            {$set: $Set({name, email, password, phone})},
            {returnDocument: "after", projection: {password:0, lastLogin:0, _id:0}},
            
        )

        return res.status(200).json({message: "User updated successfully", data: updatedUser})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}







//delete user
export const deleteUser = async(req,res)=>{
    try {
        let {id} = req.params
        if(ObjectId.isValid(id) === false){
            return res.status(400).json({message: "Please provide a valid id"})
        }


        id = ObjectId.createFromHexString(id)
        const SignedIn = await User.findOne({
            $and:[{_id: id},
            {lastLogin: {$exists: true}}]
        })


        if(!SignedIn){
            return res.status(401).json({message: "unauthorized access"})
        }

        const deletedUser = await User.deleteOne(
            {_id: id}  
        )

        
        return res.status(200).json({message: "User Deleted successfully", data: deletedUser})

    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}