import type { Request,Response,NextFunction } from "express";
import formidable from "formidable";
import fs from 'fs';

declare global{
  namespace Express{
    export interface Request{
      form:{
        fields: formidable.Fields, 
        files: formidable.Files
      }
    }
  }
}

const uploadDir = 'uploads'
fs.mkdirSync(uploadDir, { recursive: true })

const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
  filter: part => part.mimetype?.startsWith('image/') || false,
})

  export const uploadMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    form.parse(req, async(err,fields, files)=>{
      if(err){
        res.status(400).json({message: "on9"})
        return;
      }
      req.form ={fields, files}
      next()
    })
  }
  
export const userLoggedInMiddleWare = (req:Request,res:Response,next:NextFunction)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect("/")
    }
}