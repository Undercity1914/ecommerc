import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from "typeorm";
import { Address } from './address';
import { Cart } from "./cart";
import { Wishlist } from "./wishlist";

@Entity({ name: 'users' })
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ unique: true, nullable: false })
    cpf: string;

    @Column({ nullable: false })
    password: string;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToOne(() => Cart, (cart) => cart.user)
    cart: Cart;

    @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
    wishlist: Wishlist;
}