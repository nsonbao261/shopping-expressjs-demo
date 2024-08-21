import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { registerDto } from "../dto/register-dto";
import { comparePassword, getUserId, hashPassword } from "../utils";
import * as jwt from "jsonwebtoken";
import { updateUserDto } from "../dto/update-user.dto";

export class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService()
    }

    public signUp = async (req: Request, res: Response) => {
        try {
            const { email, firstName, lastName, password, avatar, gender, role } = req.body;
            const dto: registerDto = { email, firstName, lastName, avatar, password, gender, role };
            const existedUser = await this.authService.findUserByEmail(email)
            if (existedUser) {
                return res.status(404).json({
                    message: "Email is already used",
                })
            }
            const registeredUser = await this.authService.signUp(dto);
            return res.status(201).json({
                data: registeredUser,
                message: "User is created",
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Server Error",
            })
        }
    }

    public getUserById = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            const foundUser = await this.authService.findUserById(userId);
            if (foundUser) {
                return res.status(200).json({
                    data: foundUser,
                    message: "User found",
                })
            } else {
                return res.status(404).json({
                    message: "User not found",
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Server Error",
            })
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const foundUser = await this.authService.findUserByEmail(email);
            if (!foundUser) {
                return res.status(422).json({
                    message: "User not found",
                })
            }
            const isPasswordValid = await comparePassword(password, foundUser.password);
            if (!isPasswordValid) {
                return res.status(422).json({
                    message: "Password is not correct",
                })
            }
            const accessToken = jwt.sign({ userId: foundUser.userId }, "secret", { expiresIn: "1d" });
            return res.status(200).json({
                accessToken: accessToken,
                userId: foundUser.userId,
                message: "Login successfully",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server Error",
            })
        }
    }

    public changePassword = async (req: Request, res: Response) => {
        try {
            const { currentPassword, confirmPassword, newPassword } = req.body;
            if (currentPassword != confirmPassword) {
                res.status(404).json({
                    message: "Passwords do not match"
                })
            }
            const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
            const userId = getUserId(accessToken);
            const encryptedPassword = await hashPassword(newPassword);
            const dto: updateUserDto = { password: encryptedPassword }
            const updateUser = await this.authService.updateUser(userId, dto);
            const isPasswordValid = await comparePassword(newPassword, updateUser.password)
            if (!isPasswordValid) {
                return res.status(404).json({
                    message: "Password updated failed",
                })
            }
            return res.status(200).json({
                message: "Password updated successfully",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server Error",
                error
            })
        }
    }

    public getUserProfile = async (req: Request, res: Response) => {
        try {
            const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
            const userId = getUserId(accessToken);

            const user = await this.authService.findUserById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }
            const { password, createAt, updateAt, ...rest } = user;

            return res.status(200).json({
                message: "Get profile successfully",
                user: { ...rest },
            })
        } catch (error) {
            return res.status(500).json({
                message: "Server Error",
                error
            })
        }
    }
}

export default AuthController;