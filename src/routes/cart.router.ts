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
        this.router.get("/cart-details", jwtAuthorization, this.cartController.findCartByUserId);
        this.router.get("/", jwtAuthorization, this.cartController.findAllCart);
        this.router.post("/", jwtAuthorization, this.cartController.createCart);
        this.router.get("/:cartId", jwtAuthorization, this.cartController.findCartById);
        this.router.put("/:cartId", jwtAuthorization, this.cartController.updateCart);
        this.router.delete("/:cartId", jwtAuthorization, this.cartController.deleteCart);
    }
}