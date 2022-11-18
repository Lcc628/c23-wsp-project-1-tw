import type { Request, Response, NextFunction } from "express";
import formidable from "formidable";
import fs from "fs";

declare global {
  namespace Express {
    export interface Request {
      form: {
        fields: formidable.Fields;
        files: formidable.Files;
      };
    }
  }
}

const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

let counter = 0;
const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
  filename: (originalName, originalExt, part, form) => {
    counter++
    let fieldName = part.name
    let timestamp = Date.now()
    let ext = part.mimetype?.split('/').pop()
    return `${fieldName}-${timestamp}-${counter}.${ext}`
  },
});

export const uploadMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({ message: "on9" });
      return;
    }
    req.form = { fields, files };
    next();
  });
};

export const userLoggedInMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};


export const adminLoggedInMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (req.session.user?.isAdmin === true) {
    next();
  } else {
    res.redirect("/");
  }
};
