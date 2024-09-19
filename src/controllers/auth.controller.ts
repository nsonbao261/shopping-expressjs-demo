import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { registerDto } from "../dto/register-dto";
import { comparePassword, hashPassword } from "../utils";
import * as jwt from "jsonwebtoken";
import { updateUserDto } from "../dto/update-user.dto";
import { OAuth2Client } from "google-auth-library";
import { HttpStatus } from "../constants/http-status";

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
            const isPasswordValid = await comparePassword(password, foundUser.password as string);
            if (!isPasswordValid) {
                return res.status(422).json({
                    message: "Password is not correct",
                })
            }
            const accessToken = jwt.sign(
                { userId: foundUser.userId, role: foundUser.role, },
                "secret",
                { expiresIn: "1d" },
            );
            return res.status(200).json({
                accessToken: accessToken,
                email: foundUser.email,
                role: foundUser.role,
                avatar: foundUser.avatar,
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
            // const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
            // const userId = getUserId(accessToken);

            const userId = res.locals.user.userId;

            const user = await this.authService.findUserById(userId);
            if (!user) {
                res.status(HttpStatus.UNAUTHORIZED).json({
                    message: "User not found",
                })
            }
            const encryptedPassword = await hashPassword(newPassword);
            const dto: updateUserDto = { password: encryptedPassword }
            const updateUser = await this.authService.updateUser(userId, dto);
            const isPasswordValid = await comparePassword(newPassword, updateUser.password as string)
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
            // const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
            const userId = res.locals.user.userId;

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

    public loginWithGoogle = async (req: Request, res: Response) => {
        try {

            const redirectUrl = 'http://127.0.0.1:3000/api/auth/google/callback';
            const oathClient = new OAuth2Client(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                redirectUrl
            )

            const authorizeUrl = oathClient.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/userinfo.profile email',
                prompt: 'consent',
                include_granted_scopes: true,
            })


            return res.status(200).json({
                url: authorizeUrl,
                message: "Login with Google successfully",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
            })
        }
    }


    public googleCallback = async (req: Request, res: Response) => {
        try {
            const code = req.query.code as string;
            const redirectUrl = 'http://127.0.0.1:3000/api/auth/google/callback';
            const oathClient = new OAuth2Client(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                redirectUrl
            )

            const googleToken = await oathClient.getToken(code);

            const google_access_token = googleToken.tokens.access_token as string;
            const userGoogleData: any = await this.authService.getGoogleUserData(google_access_token);

            const email = userGoogleData.email;

            const existedUser = await this.authService.findUserByEmail(email);
            var userId = existedUser?.userId;
            var role = existedUser?.role
            if (!existedUser) {
                const registereData: registerDto = {
                    email: userGoogleData.email,
                    role: "Customer",
                    firstName: userGoogleData.family_name,
                    lastName: userGoogleData.given_name,
                    avatar: userGoogleData?.picture || null,
                }

                const registeredUser = await this.authService.signUp(registereData);
                userId = registeredUser.userId
                role = registeredUser.role
            }

            if (!userId || !role) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "User Information not found",
                })
            }

            const access_token = jwt.sign({ userId, role, }, "secret", { expiresIn: "1d" });


            const url = `http://localhost:5173/oauth?access_token=${access_token}`


            return res.status(200).redirect(url);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal Server Error",
            })
        }
    }
}

export default AuthController;