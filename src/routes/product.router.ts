import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { jwtAuthorization } from "../middlewares/authorization.middleware";


export default class ProductRouter {
    public router: Router;
    private productController: ProductController;

    constructor() {
        this.router = Router();
        this.productController = new ProductController();
        this.routes();
    }

    protected routes() {
        /**
         * @openapi
         * /api/product:
         *  get:
         *      tags:
         *      - Product
         *      responses:
         *          200:
         *              description: Get All Products
        */
        this.router.get("/", this.productController.findAllProduct);

        /**
         * @openapi
         * /api/product/{productId}:
         *  get:
         *      tags:
         *      - Product
         *      parameters:
         *          -   in: path
         *              name: productId
         *              schema:
         *                  type: integer
         *              required: true
         *              description: Product Id
         *      responses:
         *          200:
         *              description: Get Product By Id
        */
        this.router.get("/:productId", this.productController.findProductById);

        /**
         * @openapi
         * /api/product:
         *  post:
         *      tags:
         *      - Product
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          userId:
         *                              type: string
         *                          description:
         *                              type: string
         *                          paymentMethod:
         *                              type: string
         *                          paymentTime:
         *                              type: string
         *                          carts:
         *                              type: array
         *                              items:
         *                                  type: number
         *                              uniqueItems: true
         *                      example:
         *                          userId: XXX-XXX-XXX
         *                          description: This is description
         *                          paymentMethod: VNPAY
         *                          paymentTime: 2020-12-20
         *                          carts: [2, 1, 3]
         *      responses:
         *          201:
         *              description: Product created 
        */
        this.router.post("/", this.productController.createProduct);


        this.router.put("/:productId", jwtAuthorization, this.productController.updateProduct);
    }
}