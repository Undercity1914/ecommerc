import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from '../service/address/address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/typeorm/entities/address';
import { Users } from 'src/typeorm/entities/user';
import { UsersModule } from '../users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Users]), UsersModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
