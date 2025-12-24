import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './service/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/user';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AddressModule } from './address/address.module';
import { ProductModule } from './product/product.module';
import { ProductService } from './service/product/product.service';
import { CartModule } from './cart/cart.module';
import { CartService } from './service/cart/cart.service';
import { WishlistService } from './service/wishlist/wishlist.service';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_PASSWORD'),
        signOptions: {
          expiresIn: "1d",
        },
      }),
    }),
    ProductModule,
    CartModule,
    WishlistModule,
  ],
  exports: [JwtModule],
  controllers: [UsersController],
  providers: [UsersService, CartService, WishlistService],
})
export class UsersModule { }
