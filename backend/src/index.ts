import express from 'express'
import { userModel } from './db';
import { z } from "zod"
import mongoose from 'mongoose';
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors"


const app = express();

app.use(cors());



app.use(express.json())


app.post("/api/v1/signup", async (req, res) => {

    const requiredBody = z.object({
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100),
        email: z.string().min(3).max(100).email(),
        password: z.string().min(6).max(15)

    })

    // const parsedData = requiredBody.parse(req.body);
    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        res.json({
            message: "incorrect format",
            errror: parseDataWithSuccess.error
        })
        return
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    try {
        await userModel.create({
            firstName,
            lastName,
            email,
            password
        })
        res.json({
            msg: "sign up endpoint"
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exist"
        })
    }
})

app.post("/api/v1/signin", async (req, res) => {

    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(6).max(15)

    })

    // const parsedData = requiredBody.parse(req.body);
    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        res.json({
            message: "incorrect format",
            errror: parseDataWithSuccess.error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    
    const user = await userModel.findOne({
        email,
        password
    })

    if(user){
        if(!process.env.JWT_Password){
            throw new Error('JWT_PASSWORD is not defined in environment variables');
        }
        const token = jwt.sign({
            id:user._id
        }, process.env.JWT_Password)

        res.json({
            token
        })
    }
    else {
        res.status(403).json({
            message: "wrong credentials"
        })
    }

})


async function main(){
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URL);

    app.listen(3000)
    console.log("listening on port 3000")
}

main();