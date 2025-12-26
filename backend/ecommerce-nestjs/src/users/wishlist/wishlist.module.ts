import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/user';
import { Wishlist } from 'src/typeorm/entities/wishlist';
import { WishlistService } from '../service/wishlist/wishlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Wishlist,
    Users,
  ])],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
