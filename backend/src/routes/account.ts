import express, { Router } from "express";
import { Request, Response } from "express";


import { userMiddleware } from "../userMiddleware";
import { accountModel } from "../db";
import mongoose from "mongoose";

export const accountRouter = Router();


accountRouter.get("/balance",userMiddleware, async (req,res) => {
    const filter = req.query.filter || "";

    const accountBalance = await accountModel.findOne({
        //@ts-ignore
        userId: req.userId
    });

    res.json({
        balance: accountBalance?.balance
    })
})

accountRouter.post("/transfer",userMiddleware, async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    const account = await accountModel.findOne({
        //@ts-ignore
        userId: req.userId
    }).session(session);

    if(!account || account.balance < amount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "insufficient balance"
        })
    }

    const toAccount = await accountModel.findOne({
        userId: to
    }).session(session);

    if(!toAccount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "invalid account"
        })
    }

    await accountModel.updateOne({
        //@ts-ignore
        userId: req.userId
    }, {

        $inc: { balance: -amount }
    }).session(session)

    await accountModel.updateOne({
        userId: to
    }, {
        $inc: { balance: amount }
    }).session(session)

    await session.commitTransaction();
    res.json({
        message: "transfer successful"
    })
})