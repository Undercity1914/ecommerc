import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Cart } from 'src/typeorm/entities/cart';
import { Users } from 'src/typeorm/entities/user';
import { CartService } from '../service/cart/cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Cart,
    Users,
  ])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
