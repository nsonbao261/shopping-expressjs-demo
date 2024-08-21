import { PrismaClient } from "@prisma/client";
import { CreateCartDto } from "../dto/cart/create-cart.dto";
import { UpdateCartDto } from "../dto/cart/update-cart.dto";

export class CartService {
    prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }

    async searchCart(data: any) {
        const { productId, userId } = data;
        return await this.prisma.cart.findMany({
            where: {
                productId: productId ?? undefined,
                userId: userId ?? undefined,
            },
            include: {
                product: true,
            }
        })
    }

    async findCartById(cartId: number) {
        return await this.prisma.cart.findUnique({
            where: {
                cartId,
            }
        })
    }

    async findAllCart() {
        return await this.prisma.cart.findMany();
    }

    async createCart(dto: CreateCartDto) {
        return await this.prisma.cart.create({
            data: dto,
        })
    }

    async updateCart(dto: UpdateCartDto, cartId: number) {
        return await this.prisma.cart.update({
            where: {
                cartId,
            },
            data: dto,
        })
    }

    async deleteCart(cartId: number) {
        await this.prisma.cart.delete({
            where: {
                cartId,
            }
        })
    }

    async deleteCartByUserId(userId: string) {
        await this.prisma.cart.deleteMany({
            where: {
                userId,
            }
        })
    }
}