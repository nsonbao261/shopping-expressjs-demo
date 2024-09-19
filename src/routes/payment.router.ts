import { Router } from "express";
import { UploadControler } from "../controllers/upload.controller";
import { PaymentController } from "../controllers/payment.controller";
import { jwtAuthorization } from "../middlewares/authorization.middleware";

export default class PaymentRouter {
    public router: Router;
    private paymentController: PaymentController;
    constructor() {
        this.router = Router();
        this.paymentController = new PaymentController();
        this.routes();
    }

    protected routes() {
        this.router.post("/", jwtAuthorization, this.paymentController.createPaymentUrl);
        this.router.get("/callback", this.paymentController.paymentCallback);
    }
}