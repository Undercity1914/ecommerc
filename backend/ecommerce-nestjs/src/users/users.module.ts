import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './service/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/user';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AddressModule } from './address/address.module';

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
  ],
  exports: [JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
