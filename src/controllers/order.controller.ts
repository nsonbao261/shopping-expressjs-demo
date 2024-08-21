import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { getUserId } from "../utils";
import AuthService from "../services/auth.service";
import { createOrederDto } from "../dto/order/create-order.dto";
import { CartService } from "../services/cart.service";

export class OrderController {
    private orderService: OrderService;
    private authService: AuthService;
    private cartService: CartService

    constructor() {
        this.orderService = new OrderService();
        this.authService = new AuthService();
        this.cartService = new CartService();
    }

    public createOrder = async (req: Request, res: Response) => {
        try {
            const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
            const userId = getUserId(accessToken);

            const user = await this.authService.findUserById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }

            const { description, paymentMethod, carts } = req.body;
            const paymentTime = new Date(Date.now());
            const dto: createOrederDto
                = { userId, description, paymentMethod, paymentTime, carts }

            const order = await this.orderService.createOrder(dto);
            if (!order) {
                return res.status(404).json({
                    message: "Orders created failed",
                })
            }

            await this.cartService.deleteCartByUserId(user.userId);

            return res.status(201).json({
                order: order,
                message: "Order created successfully",
            })

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }

    public findOrderById = async (req: Request, res: Response) => {
        try {
            const orderId = Number(req.params.orderId);
            const order = await this.orderService.findOrderById(orderId)
            if (!order) {
                return res.status(404).json({
                    message: "Order not found",
                })
            }
            return res.status(200).json({
                message: "Order found",
                order: order
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
    public findAllOrder = async (req: Request, res: Response) => {
        try {
            const orders = await this.orderService.findAllOrder();
            return res.status(200).json({
                message: "Found all orders",
                orders: orders
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
    public updateOrder = async (req: Request, res: Response) => {
        try {
            const orderId = Number(req.params.orderId);
            const order = await this.orderService.findOrderById(orderId);
            if (!order) {
                res.status(404).json({
                    message: "Order not found",
                })
            }

            const { status } = req.body;
            const updatedOrder = await this.orderService.updateOrder(orderId, status)
            return res.status(200).json({
                order: updatedOrder,
                message: "Order updated",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
}