import { Router } from "express";
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { userModel } from "../db";
import { userMiddleware } from "../userMiddleware";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {

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

userRouter.post("/signin", async (req, res) => {

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

userRouter.put("/updateuser", userMiddleware, async (req, res) => {

    const updateBody = z.object({
        firstName: z.string().min(3).max(100).optional(),
        lastName: z.string().min(3).max(100).optional(),
        email: z.string().min(3).max(100).email().optional(),
        password: z.string().min(3).max(20).optional(),
    })

    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
        //@ts-ignore
		await userModel.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })


})


userRouter.get("/bulk", userMiddleware, async (req,res) => {
    const filter = req.query.filter || "";
    
    const users = await userModel.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }, {
            email: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user:users.map(user => ({

            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            _id: user._id
        }))
    })
})