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
        this.router.post("/", jwtAuthorization, this.categoryController.createCategory);
        this.router.get("/:categoryId", jwtAuthorization, this.categoryController.findCategoryById);
        this.router.get("/", jwtAuthorization, this.categoryController.findAllCategory);
        this.router.put("/:categoryId", jwtAuthorization, this.categoryController.updateCategory);
    }
}