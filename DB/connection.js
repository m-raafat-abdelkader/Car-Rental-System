import { MongoClient } from "mongodb";

const mongodbURI = 'mongodb://localhost:27017'
const client = new MongoClient(mongodbURI)
const dbName = 'Car-Rental-System'

export const connection_db = async ()=>{
    try {
       await client.connect(); 
       console.log('Connected to MongoDB');
    } catch (error) {
        console.log("Error connecting to MongoDb", error)
    }
}

export const db = client.db(dbName);
