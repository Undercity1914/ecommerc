import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product";
import { Users } from "./user";

@Entity('wishlist')
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, (product) => product.wishlist, { nullable: false, onDelete: 'CASCADE' })
    product: Product;

    @OneToOne(() => Users, (user) => user.wishlist, { nullable: false, onDelete: 'CASCADE' })
    user: Users;
}