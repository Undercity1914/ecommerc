import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/typeorm/entities/address';
import { CreateAddressParams } from 'src/utils/type';
import { Repository } from 'typeorm';
import { Users } from 'src/typeorm/entities/user';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address) private addressRepository: Repository<Address>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) { }

    async findAll(userId?: number) {
        if (!userId) return this.addressRepository.find();
        return this.addressRepository
            .createQueryBuilder('address')
            .leftJoinAndSelect('address.user', 'user')
            .where('user.id = :userId', { userId })
            .getMany();
    }

    async createAddress(addressDetails: CreateAddressParams, userId: number): Promise<Address | null> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        const newAddress = this.addressRepository.create({ ...addressDetails, user });
        const saved = await this.addressRepository.save(newAddress);
        // return with user relation loaded for clarity
        return await this.addressRepository.findOne({ where: { id: saved.id }, relations: ['user'] });
    }

    async remove(id: number, userId?: number): Promise<void> {
        if (userId) {
            // ensure the address belongs to the user
            const address = await this.addressRepository.findOne({ where: { id }, relations: ['user'] });
            if (!address) throw new NotFoundException(`Address with id ${id} not found`);
            if (!address.user || address.user.id !== userId) {
                throw new ForbiddenException('Você não tem permissão para remover este endereço');
            }
            await this.addressRepository.delete(id as any)
            return
        }
        const result = await this.addressRepository.delete(id as any);
        if (result.affected === 0) {
            throw new NotFoundException(`Address with id ${id} not found`);
        }
    }
}
