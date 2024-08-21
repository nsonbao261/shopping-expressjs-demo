import { PrismaClient } from "@prisma/client";
import { createCategoryDto } from "../dto/category/create-category.dto";
import { updateCategoryDto } from "../dto/category/update-category.dto";

export class CategoryService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createCategory(dto: createCategoryDto) {
        const { categoryName, description } = dto;
        return this.prisma.categories.create({
            data: dto,
        })
    }

    async findCategoryById(categoryId: number) {
        return this.prisma.categories.findUnique({
            where: {
                categoryId,
            }
        })
    }

    async findAllCategory() {
        return this.prisma.categories.findMany();
    }

    async updateCategory(categoryId: number, dto: updateCategoryDto) {
        return this.prisma.categories.update({
            where: {
                categoryId,
            },
            data: { ...dto },
        })
    }
}