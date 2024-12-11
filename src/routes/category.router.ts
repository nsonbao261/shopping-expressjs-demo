import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { jwtAuthorization } from "../middlewares/authorization.middleware";

export default class CategoryRouter {
    public router: Router;
    private categoryController: CategoryController;

    constructor() {
        this.router = Router();
        this.categoryController = new CategoryController();
        this.routes();
    }
    protected routes() {

        /**
         * @openapi
         * /api/category:
         *  post:
         *      tags:
         *          - Category
         *      security:
         *          - bearerAuth: []
         *      requestBody:
         *          require: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          categoryName:
         *                              type: string
         *                          description:
         *                              type: string
         *                      example:
         *                          categoryName: Sci-fi
         *                          description: This is new category description
         *      responses:
         *          201:
         *              description: Category Created
         */
        this.router.post("/", jwtAuthorization, this.categoryController.createCategory);

        /**
         * @openapi
         * /api/category/{categoryId}:
         *  get:
         *      tags:
         *          - Category
         *      security:
         *          - bearerAuth: []
         *      parameters:
         *          -   in: path
         *              name: categoryId
         *              schema:
         *                  type: integer
         *              required: true
         *              description: Category Id
         *      responses:
         *          200:
         *              description: Category found
         */
        this.router.get("/:categoryId", jwtAuthorization, this.categoryController.findCategoryById);

        /**
         * @openapi
         * /api/category:
         *  get:
         *      tags:
         *          - Category
         *      security:
         *          - bearerAuth: []
         *      responses:
         *          200:
         *              description: Get all category
         */
        this.router.get("/", jwtAuthorization, this.categoryController.findAllCategory);

        /**
         * @openapi
         * /api/category/{categoryId}:
         *  put:
         *      tags:
         *          - Category
         *      security:
         *          - bearerAuth: []
         *      parameters:
         *          -   in: path
         *              name: categoryId
         *              schema:
         *                  type: integer
         *              required: true
         *              description: Category Id
         *      requestBody:
         *          require: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          categoryName:
         *                              type: string
         *                          description:
         *                              type: string
         *                      example:
         *                          categoryName: Updated Sci-fi
         *                          description: This is updated category description
         *      responses:
         *          201:
         *              description: Category Created
         */
        this.router.put("/:categoryId", jwtAuthorization, this.categoryController.updateCategory);
    }
}