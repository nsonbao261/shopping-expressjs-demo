import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"

export const jwtAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
    if (!accessToken) {
        res.status(401).json({
            message: "Access Denied",
        })
    }

    try {
        const verified = jwt.verify(accessToken, 'secret')
        next();
    } catch (error) {
        res.status(400).json({
            message: "Token Invalid",
        })
    }
} 