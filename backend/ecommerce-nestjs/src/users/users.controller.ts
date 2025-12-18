import { Body, Controller, Get, HttpCode, HttpStatus, Post, Patch, Headers, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './service/users/users.service';
import { CreateLoginDto, CreateUsersDto } from './dtos/create-users.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

    @Get('/getUsers')
    async getUsers() {
        return this.userService.findAll()
    }

    @Get('/me')
    async me(@Headers('authorization') auth: string) {
        if (!auth) throw new UnauthorizedException('Missing authorization')
        const token = auth.replace(/^Bearer\s+/i, '')
        let payload: any
        try {
            payload = await this.jwtService.verifyAsync(token)
        } catch (e) {
            throw new UnauthorizedException('Token inválido')
        }
        const user = await this.userService.findById(payload.sub)
        if (!user) throw new UnauthorizedException()
        const { password, ...safe } = user as any
        return safe
    }

    @Patch('/me')
    async updateMe(@Headers('authorization') auth: string, @Body() body: any) {
        if (!auth) throw new UnauthorizedException('Missing authorization')
        const token = auth.replace(/^Bearer\s+/i, '')
        let payload: any
        try {
            payload = await this.jwtService.verifyAsync(token)
        } catch (e) {
            throw new UnauthorizedException('Token inválido')
        }
        const id = payload.sub
        const { currentPassword, ...updates } = body
        const user = await this.userService.findById(id)
        if (!user) throw new UnauthorizedException()
        if (user.password !== currentPassword) throw new UnauthorizedException('Senha incorreta')
        const updated = await this.userService.updateUser(id, updates)
        const { password, ...safe } = updated as any
        return safe
    }

    @Patch('/me/password')
    async changePassword(@Headers('authorization') auth: string, @Body() body: any) {
        if (!auth) throw new UnauthorizedException('Missing authorization')
        const token = auth.replace(/^Bearer\s+/i, '')
        let payload: any
        try {
            payload = await this.jwtService.verifyAsync(token)
        } catch (e) {
            throw new UnauthorizedException('Token inválido')
        }
        const id = payload.sub
        const { currentPassword, newPassword } = body
        const user = await this.userService.findById(id)
        if (!user) throw new UnauthorizedException()
        if (user.password !== currentPassword) throw new UnauthorizedException('Senha incorreta')
        await this.userService.changePassword(id, newPassword)
        return { message: 'Senha alterada' }
    }

    @Post('/signUp')
    async postUsers(@Body() createUsersDto: CreateUsersDto) {
        this.userService.createUser(createUsersDto);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: CreateLoginDto) {
        return this.userService.login(loginDto.email, loginDto.password);
    }
}
