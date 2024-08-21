import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { jwtAuthorization } from "../middlewares/authorization.middleware";

export default class OrderRouter {
    public router: Router;
    private orderController: OrderController;

    constructor() {
        this.router = Router();
        this.orderController = new OrderController();
        this.routes();
    }

    protected routes() {
        this.router.get("/", jwtAuthorization, this.orderController.findAllOrder);
        this.router.get("/:orderId", jwtAuthorization, this.orderController.findOrderById);
        this.router.post("/", jwtAuthorization, this.orderController.createOrder);
    }
}