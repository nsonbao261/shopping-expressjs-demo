import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { jwtAuthorization } from "../middlewares/authorization.middleware";

export default class AuthRouter {
    public router: Router;
    private authController: AuthController;

    constructor() {
        this.router = Router();
        this.authController = new AuthController();
        this.routes();
    }

    protected routes(): void {
        this.router.post('/signup', this.authController.signUp)
        this.router.post('/login', this.authController.login)

        this.router.post('/google', this.authController.loginWithGoogle)
        this.router.get('/google/callback', this.authController.googleCallback);

        this.router.post('/change-password', jwtAuthorization, this.authController.changePassword)
        this.router.get('/profile', jwtAuthorization, this.authController.getUserProfile)
    }
}