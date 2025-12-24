import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from 'src/typeorm/entities/wishlist';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist) private wishlistRepository: Repository<Wishlist>,
    ) { }

    async findAll() {
        return this.wishlistRepository.find();
    }
    async pushProductToWishlist(wishlist: Wishlist) {
        const newWishlistItem = this.wishlistRepository.create({ ...wishlist });
        return this.wishlistRepository.save(newWishlistItem);
    }
}
