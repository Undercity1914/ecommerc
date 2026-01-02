import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/product';
import { CreateProductParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
    ) { }

    async createProduct(productData: CreateProductParams): Promise<Product> {
        const product = this.productRepository.create({ ...productData });
        return this.productRepository.save(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async getProductById(id: number): Promise<Product | null> {
        return this.productRepository.findOne({ where: { id } });
    }

    async updateProduct(id: number, updateData: Partial<Product>): Promise<Product | null> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            return null;
        }
        Object.assign(product, updateData);
        return this.productRepository.save(product);
    }

    async deleteProduct(id: number): Promise<boolean> {
        const result = await this.productRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    async createMany(productsData: CreateProductParams[]): Promise<Product[]> {
        const products = this.productRepository.create(productsData);
        return this.productRepository.save(products);
    }
}
