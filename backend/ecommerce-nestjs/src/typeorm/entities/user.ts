import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}