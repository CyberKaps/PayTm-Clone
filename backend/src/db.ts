import mongoose, { model, Schema } from "mongoose";

mongoose.connect("");

const objectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: { type: String, required: true}
})


export const userModel = model("users", userSchema)