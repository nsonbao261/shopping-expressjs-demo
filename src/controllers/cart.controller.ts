import { Request, response, Response } from "express";
import { CartService } from "../services/cart.service";
import { ProductService } from "../services/product.service";
import { getUserId } from "../utils";
import AuthService from "../services/auth.service";
import { CreateCartDto } from "../dto/cart/create-cart.dto";
import { UpdateCartDto } from "../dto/cart/update-cart.dto";
import { updateCategoryDto } from "../dto/category/update-category.dto";

export class CartController {
    cartService: CartService;
    productService: ProductService;
    authService: AuthService;

    constructor() {
        this.cartService = new CartService();
        this.productService = new ProductService();
        this.authService = new AuthService();
    }

    public createCart = async (req: Request, res: Response) => {
        try {
            const { productId, cartQuantity } = req.body;
            const product = await this.productService.findProductById(productId)
            if (!product) {
                return res.status(404).json({
                    message: "Prorduct not found"
                })
            }

            const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
            const userId = getUserId(accessToken);

            const user = await this.authService.findUserById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }

            const existedCart = await this.cartService.searchCart({ userId: userId, productId: productId })
            if (existedCart.length > 0) {
                const cartId = existedCart[0].cartId;
                const totalQuantity = cartQuantity + existedCart[0].cartQuantity
                const dto: UpdateCartDto = { cartQuantity: totalQuantity };
                const updateCart = await this.cartService.updateCart(dto, cartId)
                return res.status(200).json({
                    cart: updateCart,
                    message: "Cart added",
                })
            }
            const dto: CreateCartDto = { userId, productId, cartQuantity }
            const cart = await this.cartService.createCart(dto);

            return res.status(201).json({
                cart: cart,
                message: "Cart added",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }

    public findCartById = async (req: Request, res: Response) => {
        try {
            const cartId = Number(req.params.cartId);
            const cart = await this.cartService.findCartById(cartId)
            if (!cart) {
                return res.status(404).json({
                    message: "Cart not found",
                })
            }
            return res.status(200).json({
                message: "Cart found",
                cart: cart
            })

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
    public findAllCart = async (req: Request, res: Response) => {
        try {
            const carts = await this.cartService.findAllCart();
            return res.status(200).json({
                carts: carts,
                message: "Carts found",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
    public updateCart = async (req: Request, res: Response) => {
        try {
            const cartId = Number(req.params.cartId);
            const cart = await this.cartService.findCartById(cartId);
            if (!cart) {
                return res.status(200).json({
                    message: "Cart not found"
                })
            }

            const { cartQuantity } = req.body;
            const dto: UpdateCartDto = { cartQuantity };
            const updatedCart = await this.cartService.updateCart(dto, cartId);
            return res.status(200).json({
                cart: updatedCart,
                message: "Cart updated",
            })

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
    public deleteCart = async (req: Request, res: Response) => {
        try {
            const cartId = Number(req.params.cartId);
            const cart = await this.cartService.findCartById(cartId);
            if (!cart) {
                return res.status(404).json({
                    message: "Cart not found",
                })
            }

            await this.cartService.deleteCart(cart.cartId);
            const deletedCart = await this.cartService.findCartById(cartId);
            if (deletedCart) {
                return res.status(404).json({
                    message: "Cart delete failed",
                })
            }

            return res.status(200).json({
                message: "Cart deleted successfully",
            })

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
    public findCartByUserId = async (req: Request, res: Response) => {
        try {

            const accessToken = req.header('Authorization')?.replace('Bearer ', '') as string;
            const userId = getUserId(accessToken);

            
            const user = await this.authService.findUserById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                })
            }

            const carts = await this.cartService.searchCart({ userId: userId });
            const totalAmount = carts.reduce((sum, current) => {
                return sum + current.product.price * current.cartQuantity;
            }, 0)
            const totalQuantity = carts.reduce((sum, current) => {
                return sum + current.cartQuantity;
            }, 0)
            return res.status(200).json({
                message: "Found cart detail successfully",
                cartDetail: {
                    cartItems: carts.sort().map((cart) => {
                        return {
                            productName: cart.product.productName,
                            productId: cart.productId,
                            price: cart.product.price,
                            description: cart.product.description,
                            imageUrl: cart.product.imageUrl,
                            quantity: cart.cartQuantity,
                            stockQuantity: cart.product.stockQuantity,
                            cartId: cart.cartId,
                        }
                    }),
                    totalAmount: totalAmount,
                    totalQuantity: totalQuantity
                }
            })

        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            })
        }
    }
}