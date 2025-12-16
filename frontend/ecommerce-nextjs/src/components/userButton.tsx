import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, Heart, LogOut, ShoppingCart, User, User2, WashingMachine } from "lucide-react";
import { Button } from "./ui/button";

export default function UserButton() {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger><Button variant={"ghost"} className="bg-background text-shadow-background cursor-pointer"><User2 /></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem><User />Perfil</DropdownMenuItem>
                        <DropdownMenuItem><CreditCard />Pedidos</DropdownMenuItem>
                        <DropdownMenuItem><ShoppingCart />Carrinho</DropdownMenuItem>
                        <DropdownMenuItem><Heart />Lista de Desejos</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem><LogOut/>Sair</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}