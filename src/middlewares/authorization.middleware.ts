import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken"
import { HttpStatus } from "../constants";

export const jwtAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
    if (!accessToken) {
        res.status(401).json({
            message: "Access Denied",
        })
    }

    try {
        const jwtPayload = <any>jwt.verify(accessToken, 'secret')
        if (!jwtPayload.userId || !jwtPayload.role) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: "User Information Invalid",
            })
        }
        res.locals.user = jwtPayload;
        next();
    } catch (error) {
        res.status(400).json({
            message: "Token Invalid",
        })
    }
} 