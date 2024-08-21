import { Router } from "express";
import { UploadControler } from "../controllers/upload.controller";
import { jwtAuthorization } from "../middlewares/authorization.middleware";
import { upload } from "../middlewares/multer.middleware";

export default class UoloadRouter {
    public router: Router;
    private uploadController: UploadControler;

    constructor() {
        this.router = Router();
        this.uploadController = new UploadControler();
        this.routes();
    }

    protected routes() {
        this.router.post("/", upload.single('file'), this.uploadController.uploadFile);
    }
}