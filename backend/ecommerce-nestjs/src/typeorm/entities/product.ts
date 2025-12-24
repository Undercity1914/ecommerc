import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart";
import { Wishlist } from "./wishlist";

@Entity({ name: 'product' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ type: 'decimal', nullable: false })
    price: number;

    @Column({ nullable: false })
    description: string;
    
    @Column({ nullable: false })
    code: string;

    @Column({ nullable: false })
    image: string;

    @Column({ type: 'int', nullable: false })
    stock: number;

    @ManyToOne(() => Cart, (cart) => cart.product, { nullable: false, onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Wishlist, (wishlist) => wishlist.product, { nullable: false, onDelete: 'CASCADE' })
    wishlist: Wishlist;
}