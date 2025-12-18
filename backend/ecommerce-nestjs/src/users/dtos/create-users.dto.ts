export class CreateUsersDto {
    name: string;
    email: string;
    cpf: string;
    password: string;
}

export class CreateLoginDto {
    email: string;
    password: string;
}