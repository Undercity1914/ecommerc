import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/user';
import { CreateUsersParams } from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        private jwtService: JwtService,
    ) { }

    async findAll() {
        return this.usersRepository.find();
    }

    async createUser(usersDetails: CreateUsersParams): Promise<Users> {
        const newUser = this.usersRepository.create({ ...usersDetails });
        return this.usersRepository.save(newUser);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async login(email: string, pass: string) {
        const user = await this.findByEmail(email);
        if (user?.password !== pass) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        const payload = { sub: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async findById(id: number) {
        return this.usersRepository.findOne({ where: { id } })
    }

    async updateUser(id: number, updates: Partial<Users>) {
        await this.usersRepository.update(id, { ...updates })
        return this.findById(id)
    }

    async changePassword(id: number, newPassword: string) {
        await this.usersRepository.update(id, { password: newPassword })
        return this.findById(id)
    }
}
