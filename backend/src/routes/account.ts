import express, { Router } from "express";


import { userMiddleware } from "../userMiddleware";
import { accountModel } from "../db";

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