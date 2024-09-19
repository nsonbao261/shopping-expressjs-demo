import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { HttpStatus, OrderStattus } from "../constants";
import { OrderService } from "../services/order.service";

export class PaymentController {

    private paymentService: PaymentService;
    private orderService: OrderService;

    constructor() {
        this.paymentService = new PaymentService();
        this.orderService = new OrderService();
    }

    public createPaymentUrl = async (req: Request, res: Response) => {
        try {
            const ipAddr = req.ip;
            const { orderId, } = req.body;

            const order = await this.orderService.findOrderById(orderId);

            if (!order) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Order not found",
                })
            }

            const totalCost = order.paymentAmount;

            const paymentUrl = await this.paymentService.createPaymentUrl({
                orderId, totalCost, ipAddr,
            });

            if (!paymentUrl) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Cannot create payment Url",
                })
            }

            return res.status(HttpStatus.ACCEPTED).json({
                message: "Payment url Created",
                paymentUrl: paymentUrl,
            })
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            })
        }
    }

    public paymentCallback = async (req: Request, res: Response) => {
        try {
            const vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash']

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType']

            const txnRef = vnp_Params['vnp_TxnRef'] as string;

            const orderId = Number(txnRef.split("_")[0]);

            const isCallbackValid = await this.paymentService.checkVnpayCallback(
                { vnp_Params, secureHash }
            );

            if (isCallbackValid && vnp_Params['vnp_ResponseCode'] !== "00") {
                await this.orderService.updateOrder(orderId, OrderStattus.SUCCESS)
                return res.status(HttpStatus.ACCEPTED).redirect(
                    `http://localhost:5173/payment-result?paymentStatus=1`
                );
            } else {
                await this.orderService.updateOrder(orderId, OrderStattus.FAILED);
                return res.status(HttpStatus.ACCEPTED).redirect(
                    `http://localhost:5173/payment-result?paymentStatus=0`
                );
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).redirect(
                'http://localhost:5173/payment-result?paymentStatus=-1'
            )
        }
    }
}