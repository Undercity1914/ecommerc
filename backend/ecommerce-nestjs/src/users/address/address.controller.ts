import { Body, Controller, Get, Post, Delete, Param, ParseIntPipe, Headers, UnauthorizedException } from '@nestjs/common';
import { AddressService } from '../service/address/address.service';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('address')
export class AddressController {
    constructor(
        private readonly addressService: AddressService,
        private readonly jwtService: JwtService,
    ) { }

    private verifyTokenGetId(auth?: string) {
        if (!auth) throw new UnauthorizedException('Missing authorization')
        const token = auth.replace(/^Bearer\s+/i, '')
        try {
            const payload: any = this.jwtService.verify(token)
            return payload.sub as number
        } catch (e) {
            throw new UnauthorizedException('Token inválido')
        }
    }

    @Post('/create')
    createAddress(@Headers('authorization') auth: string, @Body() addressDetails: CreateAddressDto) {
        const userId = this.verifyTokenGetId(auth)
        return this.addressService.createAddress(addressDetails, userId);
    }

    @Get('/all')
    getAllAddresses(@Headers('authorization') auth: string) {
        const userId = this.verifyTokenGetId(auth)
        return this.addressService.findAll(userId);
    }

    @Delete('/:id')
    removeAddress(@Headers('authorization') auth: string, @Param('id', ParseIntPipe) id: number) {
        const userId = this.verifyTokenGetId(auth)
        return this.addressService.remove(id, userId);
    }
}
