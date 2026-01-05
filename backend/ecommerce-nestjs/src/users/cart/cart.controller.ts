import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { CartService } from '../service/cart/cart.service';
import { JwtService } from '@nestjs/jwt';


@Controller('cart')
export class CartController {
	constructor(
		private cartService: CartService,
		private jwtService: JwtService,
	) {}

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
	async create(@Headers('authorization') auth: string, @Body() body: any) {
		const userId = this.verifyTokenGetId(auth)
		const { productId, quantity } = body;
		return this.cartService.createCart(productId, userId);
	}

	@Get('/all')
	async findAll(@Headers('authorization') auth: string) {
		const userId = this.verifyTokenGetId(auth)
		return this.cartService.findAll(userId);
	}

	@Post('/remove')
	async remove(@Headers('authorization') auth: string, @Body() body: any) {
		const userId = this.verifyTokenGetId(auth)
		const { productId } = body;
		return this.cartService.removeProductFromCart(productId, userId);
	}
}
