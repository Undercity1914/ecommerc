import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post
} from '@nestjs/common';
import { ProductService } from '../service/product/product.service';
import { CreateProductDto } from '../dtos/create-product';

@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) { }

    @Get('/all')
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('/:id')
    async getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getProductById(id);
    }

    @Post('/create')
    async createProduct(@Body() productData: CreateProductDto) {
        return this.productService.createProduct(productData);
    }

    @Patch('/:id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<CreateProductDto>,
    ) {
        return this.productService.updateProduct(id, updateData);
    }

    @Delete('/:id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productService.deleteProduct(id);
    }
}
