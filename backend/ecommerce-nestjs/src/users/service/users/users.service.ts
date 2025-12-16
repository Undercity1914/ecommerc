import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/user';
import { CreateUsersParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>
    ) { }

    async findAll() {
        return this.usersRepository.find();
    }

    async createUser(usersDetails: CreateUsersParams): Promise<Users> {
        const newUser = this.usersRepository.create({ ...usersDetails });
        return this.usersRepository.save(newUser);
    }
}
