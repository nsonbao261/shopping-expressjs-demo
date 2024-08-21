import { OrderStattus, Prisma, PrismaClient } from "@prisma/client";
import { createOrederDto } from "../dto/order/create-order.dto";

export class OrderService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createOrder(dto: createOrederDto) {
        const { carts, ...rest } = dto
        const orderDetails = await this.prisma.cart.findMany({
            where: {
                cartId: {
                    in: carts
                }
            },
            include: {
                product: true,
            }
        })

        return await this.prisma.orders.create({
            data: {
                ...rest,
                paymentAmount: orderDetails.reduce((initial, current) => {
                    const cartAmount = current.cartQuantity * current.product.price;
                    return initial + cartAmount;
                }, 0),
                orderDetails: {
                    create: orderDetails.map((detail) => {
                        return {
                            productId: detail.productId,
                            amount: detail.cartQuantity * detail.product.price,
                            quantity: detail.cartQuantity,
                        }
                    })
                }
            }
        })
    }

    async findOrderById(orderId: number) {
        return await this.prisma.orders.findFirst({
            where: {
                orderId,
            },
            include: {
                orderDetails: {
                    include: {
                        product: true,
                    }
                },
            }
        })
    }

    async findAllOrder() {
        return await this.prisma.orders.findMany({
            include: {
                orderDetails: {
                    include: {
                        product: true,
                    }
                }
            }
        });
    }

    async updateOrder(orderId: number, status: OrderStattus) {
        return await this.prisma.orders.update({
            where: {
                orderId,
            },
            data: {
                status,
            }
        })
    }
}