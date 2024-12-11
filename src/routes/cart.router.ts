import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { jwtAuthorization } from "../middlewares/authorization.middleware";

export default class CartRouter {
    public router: Router;
    private cartController: CartController;

    constructor() {
        this.router = Router();
        this.cartController = new CartController();
        this.routes();
    }

    protected routes() {
        /**
         * @openapi
         * /api/cart/cart-details:
         *  get:
         *      security:
         *          -   bearerAuth: []
         *      tags:
         *          -   Cart
         *      responses:
         *          200:
         *              description: Found cart detail by userId
         */
        this.router.get("/cart-details", jwtAuthorization, this.cartController.findCartByUserId);


        /**
         * @openapi
         * /api/cart:
         *  get:
         *      tags:
         *          -   Cart
         *      security:
         *          -   bearerAuth: []
         *      responses:
         *          200:
         *              description: Found all cart
         */
        this.router.get("/", jwtAuthorization, this.cartController.findAllCart);

        /**
         * @openapi
         * /api/cart:
         *  post:
         *      tags:
         *          -   Cart
         *      security:
         *          -   bearerAuth: []
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          productId:
         *                              type: integer
         *                          userId:
         *                              type: string
         *                          cartQuantity:
         *                              type: integer
         *                      example:
         *                          productId: 1
         *                          userId: AAA-AAA-AAA
         *                          cartQuantity: 20
         *      responses:
         *          201:
         *              description: Cart Created
         */
        this.router.post("/", jwtAuthorization, this.cartController.createCart);

        /**
         * @openapi
         * /api/cart/{cartId}:
         *  get:
         *      tags:
         *          -   Cart
         *      security:
         *          -   bearerAuth: []
         *      parameters:
         *          -   in: path
         *              schema:
         *                  type: integer
         *              required: true
         *      responses:
         *          200:
         *              description: Get cart by id
         */
        this.router.get("/:cartId", jwtAuthorization, this.cartController.findCartById);

        /**
         * @openapi
         * /api/cart/{cartId}:
         *  put:
         *      tags:
         *          -   Cart
         *      security:
         *          -   bearerAuth: []
         *      parameters:
         *          -   in: path
         *              schema:
         *                  type: integer
         *              required: true
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          cartQuantity:
         *                              type: integer
         *                      example:
         *                          cartQuantity: 20
         *      responses:
         *          200:
         *              description: Update cart by id
         */
        this.router.put("/:cartId", jwtAuthorization, this.cartController.updateCart);

        /**
         * @openapi
         * /api/cart/{cartId}:
         *  put:
         *      tags:
         *          -   Cart
         *      security:
         *          -   bearerAuth: []
         *      parameters:
         *          -   in: path
         *              schema:
         *                  type: integer
         *              required: true
         */
        this.router.delete("/:cartId", jwtAuthorization, this.cartController.deleteCart);
    }
}