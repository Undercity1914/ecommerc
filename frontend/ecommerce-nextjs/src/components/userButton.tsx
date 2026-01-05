import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, Heart, LogIn, LogOut, ShoppingCart, User, User2, WashingMachine } from "lucide-react";
import { Button } from "./ui/button";
import Wishlist from "./wishlist";
import Cart from "./cart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserButton() {
    const [logged, setLogged] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {

        if (localStorage.getItem("token"))
            setLogged(true);
        else
            setLogged(false);

    }, [])

    function handleLogout() {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger><Button variant={"ghost"} className="bg-background text-shadow-background cursor-pointer"><User2 /></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {logged ? (
                        <>
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}><User />Perfil</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/orders')}><CreditCard />Pedidos</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setCartOpen(true)}><ShoppingCart />Carrinho</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setWishlistOpen(true)}><Heart />Lista de Desejos</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}><LogOut />Sair</DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer"><ShoppingCart />Carrinho</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/login')}><LogIn />Entrar</DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <Wishlist open={wishlistOpen} onOpenChange={setWishlistOpen} />
            <Cart open={cartOpen} onOpenChange={setCartOpen} />
        </div>
    );
}