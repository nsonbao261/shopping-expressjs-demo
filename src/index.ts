import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRouter from "./routes/auth.router";
import bodyParser from "body-parser";
import ProductRouter from "./routes/product.router";
import CategoryRouter from "./routes/category.router";
import UploadRouter from "./routes/upload.router";
import CartRouter from "./routes/cart.router";
import OrderRouter from "./routes/order.router";

dotenv.config();

const PORT = process.env.PORT || 8001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/api/auth', new AuthRouter().router);
app.use('/api/product', new ProductRouter().router);
app.use('/api/category', new CategoryRouter().router);
app.use('/api/cart', new CartRouter().router);
app.use('/api/upload', new UploadRouter().router);
app.use('/api/order', new OrderRouter().router);

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
