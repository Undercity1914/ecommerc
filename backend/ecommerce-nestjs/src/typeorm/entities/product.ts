import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}