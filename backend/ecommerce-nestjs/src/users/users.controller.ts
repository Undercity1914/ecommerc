import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './service/users/users.service';
import { CreateUsersDto } from './dtos/create-users.dto';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService
    ) { }

    @Get('/getUsers')
    async getUsers() { 
        return this.userService.findAll()
    }

    @Post('/signUp')
    async postUsers(@Body() createUsersDto: CreateUsersDto) {
        this.userService.createUser(createUsersDto);
    }
}
