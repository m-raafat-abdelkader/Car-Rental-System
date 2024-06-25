import express from 'express';
import { connection_db } from './DB/connection.js';
import  userRouter  from './src/Modules/Users/user.routes.js';
import  carRouter  from './src/Modules/Cars/car.routes.js';
import  rentalRouter from './src/Modules/Rentals/rental.routes.js';


const app = express();

const port = process.env.PORT || 5000;



app.listen(port, ()=>{console.log(`server is running on port ${port}`)});

connection_db();



app.use(express.json());

app.use('/user', userRouter);
app.use('/car', carRouter);
app.use('/rental', rentalRouter)



