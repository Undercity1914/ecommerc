import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './service/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/user';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: process.env.JWT_PASSWORD,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
