"use client";

import { LogIn, Search, SignpostIcon, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import UserButton from "./userButton";
import Notifications from "./notificationButton";
import { ModeToggle } from "./themeButton";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    return (
        <header className="min-w-full flex flex-col">
            <div className="flex justify-between space-x-2">
                <InputGroup className="max-w-100 bg-[#FAFAFA]">
                    <InputGroupInput placeholder="Digite aqui..." />
                    <InputGroupAddon>
                        <Button variant={"secondary"} className="bg-transparent text-shadow-background w-2 h-2 ml-2 cursor-pointer"><Search /></Button>
                    </InputGroupAddon>
                </InputGroup>
                <div className="pr-20 flex justify-between space-x-2">
                    <ModeToggle/>
                    <Button variant={"ghost"} onClick={() => router.push('/signup')} className="bg-bacground text-shadow-background cursor-pointer"><UserPlus/>Cadastrar-se</Button>
                    <Notifications/>
                    <UserButton/>
                </div>
            </div>
        </header>
    );
}