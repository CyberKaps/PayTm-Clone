import mongoose, { model, Schema } from "mongoose";
import { number } from "zod";

// mongoose.connect("");

const objectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true}
})
export const userModel = model("User", userSchema);


const accountSchema = new Schema({
    userId: { type: objectId, required: true, ref: "User"},
    balance: number
})
export const accountModel = model("Account", accountSchema);