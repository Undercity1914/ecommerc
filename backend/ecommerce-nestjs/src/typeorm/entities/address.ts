import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./user";

@Entity({ name: 'address' })
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    street: string;

    @Column({ nullable: false })
    city: string;

    @Column({ nullable: false })
    state: string;

    @Column({ nullable: false })
    zip: string;

    @Column({ nullable: false })
    country: string;

    @ManyToOne(() => Users, (user) => user.addresses, { nullable: false, onDelete: 'CASCADE' })
    user: Users;
}