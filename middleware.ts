import type { Request,Response,NextFunction } from "express";

export const userLoggedInMiddleWare = (req:Request,res:Response,next:NextFunction)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect("/")
    }
}