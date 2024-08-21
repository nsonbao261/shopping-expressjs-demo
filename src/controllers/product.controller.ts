import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { CreateProductDto } from "../dto/products/create-product.dto";
import { UpdateProductDto } from "../dto/products/update-product.dto";

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    public createProduct = async (req: Request, res: Response) => {
        try {
            const {
                productName,
                categoryId,
                description,
                stockQuantity,
                price,
                minPlayer,
                maxPlayer,
                duration,
                imageUrl } = req.body;
            const dto: CreateProductDto = {
                productName,
                categoryId,
                price,
                stockQuantity,
                description,
                maxPlayer,
                minPlayer,
                duration,
                imageUrl
            };

            const createdProduct = await this.productService.createProduct(dto);
            return res.status(201).json({
                message: "Product is created",
                product: createdProduct,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }

    }

    public findProductById = async (req: Request, res: Response) => {
        try {
            const productId = Number(req.params.productId);
            const product = await this.productService.findProductById(productId);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                })
            }
            return res.status(200).json({
                message: "Product found",
                product: product,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }

    public findAllProduct = async (req: Request, res: Response) => {
        try {
            const products = await this.productService.findAllProduct();
            return res.status(200).json({
                message: "Found all products",
                products: products.map((product) => {
                    const { createdAt, updatedAt, category, categoryId, ...rest } = product
                    return {
                        categoryName: category.categoryName,
                        ...rest
                    }
                }),
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
    public updateProduct = async (req: Request, res: Response) => {
        try {
            const productId = Number(req.params.productId);
            const { productName, categoryId, description, stockQuantity, price } = req.body;
            const dto: UpdateProductDto = { productName, categoryId, description, stockQuantity, price }

            const updatedProduct = await this.productService.updateProduct(productId, dto);
            return res.status(200).json({
                message: "Product updated successfully",
                product: updatedProduct,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }

    public deleteProduct = async (req: Request, res: Response) => {
        try {

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
}