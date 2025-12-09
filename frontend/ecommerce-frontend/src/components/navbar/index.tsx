import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { SidebarTrigger } from "../ui/sidebar";

export default function Navbar(){
    return(
        <div className="p-2 flex flex-col items-center">
            <header >
                <Sheet>
                    <h1 className="font-bold text-2xl p-5">Ecommerce App</h1>
                    <SheetTrigger>
                    </SheetTrigger>    
                </Sheet>                
            </header>
            <nav className="flex p-2 w-screen">
                <Button variant={"ghost"} className="bg-black text-white cursor-pointer">Pesquisar Produto</Button>
                <Input type="text" placeholder="Digite o nome do item" className="bg-white ml-2"/>
                <Button variant={"ghost"} className="bg-black text-white cursor-pointer ml-2">Página inicial</Button>
                <Button variant={"ghost"} className="bg-black text-white cursor-pointer ml-2">Entrar</Button>
                <Button variant={"ghost"} className="bg-black text-white cursor-pointer ml-2">Cadastrar-se</Button>
            </nav>
        </div>
    );
}