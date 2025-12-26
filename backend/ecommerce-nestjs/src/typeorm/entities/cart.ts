import { Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user";
import { Product } from "./product";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Product, (product) => product.cart)
    product: Product;

    @OneToOne(() => Users, (user) => user.cart, { nullable: false, onDelete: 'CASCADE' })
    user: Users;
}