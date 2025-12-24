import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user";
import { Product } from "./product";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.cart, { nullable: false, onDelete: 'CASCADE' })
    product: Product;

    @OneToOne(() => Users, (user) => user.cart, { nullable: false, onDelete: 'CASCADE' })
    user: Users;
}