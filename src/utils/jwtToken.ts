import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { jwtPayloadDto } from "../dto/jwt-payload.dto";

export const getUserId = (accessToken: string) => {
    const decoded = jwt.verify(accessToken, "secret") as jwtPayloadDto;
    return decoded.userId;
}