import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export function userMiddleware(req: Request, res: Response, next: NextFunction) {

    if(!process.env.JWT_PASSWORD){
        throw new Error("JWT_PASSWORD is not present ")
    }
    
    const token = req.headers['authorization'];


    try {
        const decoded = jwt.verify(token as string, process.env.JWT_PASSWORD)
        if(decoded){
            //@ts-ignore
            req.userId = decoded.id;
            next();
        }
    } catch(e) {
        res.status(403).json({
            message: "you are not logged in"
        })
    
    }
}