import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Address } from './address';

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
}