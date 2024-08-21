import { PrismaClient } from "@prisma/client";
import { CreateProductDto } from "../dto/products/create-product.dto";
import { updateUserDto } from "../dto/update-user.dto";
import { UpdateProductDto } from "../dto/products/update-product.dto";

export class ProductService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createProduct(dto: CreateProductDto) {
        return this.prisma.products.create({
            data: {
                ...dto,
            },
            select: {
                category: true,
                productName: true,
                price: true,
                stockQuantity: true,
                description: true,
                maxPlayer: true,
                minPlayer: true,
                duration :true,
                imageUrl: true
            }
        })
    }

    async findProductById(id: number) {
        return this.prisma.products.findUnique({
            where: {
                productId: id,
            },
            include: {
                category: true
            }
        })
    }

    async findAllProduct() {
        return this.prisma.products.findMany({
            include: {
                category: true,
            }
        });
    }

    async updateProduct(id: number, dto: UpdateProductDto) {
        return this.prisma.products.update({
            data: { ...dto },
            where: {
                productId: id,
            }
        })
    }
}