import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from 'src/typeorm/entities/wishlist';
import { Repository } from 'typeorm';


@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist) private wishlistRepository: Repository<Wishlist>,
    ) { }

    async findAll(userId?: number) {
        if (!userId) return this.wishlistRepository.find({ relations: ['product', 'user'] });
        return this.wishlistRepository.find({ where: { user: { id: userId } }, relations: ['product'] });
    }

    async pushProductToWishlist(productId: number, userId: number) {
        const newWishlistItem = this.wishlistRepository.create({ product: { id: productId } as any, user: { id: userId } as any });
        return this.wishlistRepository.save(newWishlistItem);
    }
}
