import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Cart } from 'src/typeorm/entities/cart';
import { Users } from 'src/typeorm/entities/user';
import { CartService } from '../service/cart/cart.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([
    Cart,
    Users,
  ]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_PASSWORD'),
      signOptions: { expiresIn: '1d' },
    }),
  }),
],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
