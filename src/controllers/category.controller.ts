import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { createCategoryDto } from "../dto/category/create-category.dto";
import { updateCategoryDto } from "../dto/category/update-category.dto";

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService()
    }

    public createCategory = async (req: Request, res: Response) => {
        try {
            const { categoryName, description } = req.body;
            const dto: createCategoryDto = { categoryName, description };
            const category = await this.categoryService.createCategory(dto);
            return res.status(200).json({
                category: category,
                message: "Category created successfully"
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }


    public findCategoryById = async (req: Request, res: Response) => {
        try {
            const catrgoryId = Number(req.params.categoryId);
            const category = await this.categoryService.findCategoryById(catrgoryId);
            if (!category) {
                return res.status(404).json({
                    message: "Category not found",
                })
            }

            return res.status(200).json({
                message: "Category found",
                category: category,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }

    public findAllCategory = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryService.findAllCategory();
            return res.status(200).json({
                message: "Categories found",
                categories: categories,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }

    public updateCategory = async (req: Request, res: Response) => {
        try {
            const categoryId = Number(req.params.categoryId);

            const foundCategory = await this.categoryService.findCategoryById(categoryId);
            if (!foundCategory) {
                return res.status(404).json({
                    message: "Category not found",
                })
            }

            const { categoryName, description } = req.body;
            const dto: updateCategoryDto = { categoryName, description };

            const category = await this.categoryService.updateCategory(categoryId, dto);
            return res.status(200).json({
                message: "Category update successfully",
                category: category,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }

}