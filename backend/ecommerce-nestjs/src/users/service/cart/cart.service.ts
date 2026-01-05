
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/typeorm/entities/cart';


@Injectable()
export class CartService {
	constructor(
		@InjectRepository(Cart) private cartRepository: Repository<Cart>,
	) {}

	async createCart(productId: number, userId: number) {
		// find existing cart for user
		let cart: Cart | null = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['products', 'user'] });
		if (!cart) {
			cart = this.cartRepository.create({ user: { id: userId } as any, products: [] } as Partial<Cart> ) as Cart;
		}
		// now cart is guaranteed
		if (!cart.products) {
			cart.products = [];
		}
		const exists = cart.products.some((p: any) => Number(p.id) === Number(productId));
		if (!exists) {
			cart.products.push({ id: productId } as any);
		}
		return this.cartRepository.save(cart);
	}

	async findAll(userId?: number) {
		if (!userId) return this.cartRepository.find({ relations: ['products', 'user'] });
		return this.cartRepository.find({ where: { user: { id: userId } }, relations: ['products'] });
	}

	async removeProductFromCart(productId: number, userId: number) {
		const cart: Cart | null = await this.cartRepository.findOne({ where: { user: { id: userId } }, relations: ['products'] });
		if (!cart || !cart.products) return { deleted: false };
		const idx = cart.products.findIndex((p: any) => Number(p.id) === Number(productId));
		if (idx === -1) return { deleted: false };
		cart.products.splice(idx, 1);
		await this.cartRepository.save(cart);
		return { deleted: true };
	}
}
