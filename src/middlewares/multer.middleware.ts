import { NextFunction, Request, Response } from 'express';
import multer from 'multer';


export const upload = multer({
    storage: multer.memoryStorage(),
})