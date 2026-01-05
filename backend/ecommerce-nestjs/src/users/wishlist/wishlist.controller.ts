import { Body, Controller, Post, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { WishlistService } from '../service/wishlist/wishlist.service';
import { JwtService } from '@nestjs/jwt';

@Controller('wishlist')
export class WishlistController {
    constructor(
        private wishlistService: WishlistService,
        private jwtService: JwtService,
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
    async createWishlist(@Headers('authorization') auth: string, @Body() body: any) {
        const userId = this.verifyTokenGetId(auth)
        const { productId } = body;
        return this.wishlistService.pushProductToWishlist(productId, userId);
    }

    @Get('/all')
    async getAll(@Headers('authorization') auth: string) {
        const userId = this.verifyTokenGetId(auth)
        return this.wishlistService.findAll(userId);
    }
}
