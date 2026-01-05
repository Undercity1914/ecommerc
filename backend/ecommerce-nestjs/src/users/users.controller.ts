import { Body, Controller, Get, HttpCode, HttpStatus, Post, Patch, Headers, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { UsersService } from './service/users/users.service';
import { CreateLoginDto, CreateUsersDto } from './dtos/create-users.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

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

    @Patch('/me/avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const dest = path.resolve(process.cwd(), '..', '..', 'frontend', 'ecommerce-nextjs', 'public', 'userAvatar')
                try {
                    fs.mkdirSync(dest, { recursive: true })
                } catch (e) {
                }
                cb(null, dest)
            },
            filename: (req, file, cb) => {
                const timestamp = Date.now()
                const safeName = file.originalname.replace(/[^a-z0-9.\-\_]/gi, '_')
                cb(null, `${timestamp}_${safeName}`)
            }
        })
    }))
    async uploadAvatar(@Headers('authorization') auth: string, @UploadedFile() file: any) {
        if (!auth) throw new UnauthorizedException('Missing authorization')
        const token = auth.replace(/^Bearer\s+/i, '')
        let payload: any
        try {
            payload = await this.jwtService.verifyAsync(token)
        } catch (e) {
            throw new UnauthorizedException('Token inválido')
        }
        const id = payload.sub
        if (!file) throw new UnauthorizedException('No file uploaded')
        const avatarPath = `/userAvatar/${file.filename}`
        const updated = await this.userService.updateUser(id, { avatar: avatarPath })
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
