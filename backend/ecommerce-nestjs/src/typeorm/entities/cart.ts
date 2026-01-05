import { Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn, JoinTable } from "typeorm";
import { Users } from "./user";
import { Product } from "./product";

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Product)
    @JoinTable({ name: 'cart_products' })
    products: Product[];

    @OneToOne(() => Users, (user) => user.cart, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    user: Users;
}