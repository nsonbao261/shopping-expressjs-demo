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
        /**
         * @openapi
         * /api/auth/signup:
         *  post:
         *      tags:
         *          - Auth
         *      requestBody:
         *          require: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          email:
         *                              type: string
         *                          password:
         *                              type: string
         *                          firstName:
         *                              type: string
         *                          lastName:
         *                              type: string
         *                          role:
         *                              type: string
         *                      example:
         *                          email: nsonbao1206@gmail.com
         *                          password: password
         *                          firstName: Nguyen
         *                          lastName: Son Bao
         *                          role: Customer
         *      responses:
         *          201:
         *              description: User Registered
         */
        this.router.post('/signup', this.authController.signUp)

        /**
         * @openapi
         * /api/auth/login:
         *  post:
         *      tags:
         *          - Auth
         *      requestBody:
         *          require: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          email:
         *                              type: string
         *                          password:
         *                              type: string
         *                      example:
         *                          email: customer@example.com
         *                          password: "12345678"
         *      responses:
         *          200:
         *              description: User Login
         */
        this.router.post('/login', this.authController.login)

        this.router.post('/google', this.authController.loginWithGoogle)
        this.router.get('/google/callback', this.authController.googleCallback);

        /**
         * @openapi
         * /api/auth/change-password:
         *  put:
         *      security:
         *          - bearerAuth: []
         *      tags:
         *          - Auth
         *      requestBody:
         *          require: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          currentPassword:
         *                              type: string
         *                          newPassword:
         *                              type: string
         *                      example:
         *                          currentPassword: "12345678"
         *                          newPassword: newPassword
         *      responses:
         *          200:
         *              description: Password changed
         */
        this.router.put('/change-password', jwtAuthorization, this.authController.changePassword)

        /**
         * @openapi
         * /api/auth/profile:
         *  get:
         *      tags:
         *          - Auth
         *      security:
         *          - bearerAuth: []
         *      responses:
         *          200:
         *              description: Get Profile
         */
        this.router.get('/profile', jwtAuthorization, this.authController.getUserProfile)
    }
}