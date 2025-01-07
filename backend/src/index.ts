import express from 'express'
import mongoose from 'mongoose';
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors"
import { userRouter } from './routes/user';
import { accountRouter } from './routes/account';

const app = express();
app.use(cors());
app.use(express.json())


app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);


async function main(){
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URL);

    app.listen(3000)
    console.log("listening on port 3000")
}

main();