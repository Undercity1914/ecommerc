export type CreateUsersParams = {
    name: string;
    email: string;
    cpf: string;
    password: string;
}

export type CreateAddressParams = {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export type CreateProductParams = {
    name: string;
    price: number;
    description: string;
    code: string;
    image: string;
    stock: number;
}