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
        this.router.get("/", jwtAuthorization, this.productController.findAllProduct);
        this.router.get("/:productId", jwtAuthorization, this.productController.findProductById);
        this.router.post("/", jwtAuthorization, this.productController.createProduct);
        this.router.put("/", jwtAuthorization, this.productController.updateProduct);
    }
}