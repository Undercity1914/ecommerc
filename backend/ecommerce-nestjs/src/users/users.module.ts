import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './service/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
