export interface UpdateProductDto {
    productName?: string
    categoryId?: number
    price?: number
    stockQuantity?: number
    description?: string
    minPlayer?: number
    maxPlayer?: number
    duration?: number
    imageUrl?: string
}