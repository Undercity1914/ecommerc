"use client"

import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ChevronUp, Home, Inbox, Search, ShoppingCart, User2 } from "lucide-react"
import Cart from "./cart"
import { NavUser } from "./navUser"

const users = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
}

const items = [
    {
        title: "Página inicial",
        url: "/",
        icon: Home
    },
    {
        title: "Carrinho",
        url: "#",
        icon: ShoppingCart
    },
    {
        title: "Procurar",
        url: "#",
        icon: Search
    },
    {
        title: "Entrar",
        url: "/login",
        icon: User2,
    }
]

export function AppSidebar() {
  const [logged, setLogged] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogged(!!localStorage.getItem("token"));
    }
  }, []);

  return (
    <Sidebar>
        <SidebarHeader/>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Ecommerce app</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.filter(item => !(item.title === 'Entrar' && logged)).map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    {item.title === 'Carrinho' ? (
                                        <button onClick={() => setCartOpen(true)} className="flex items-center gap-2">
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </button>
                                    ) : (
                                        <a href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </a>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        
                    </SidebarMenu>
                    
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="pb-20">
            <NavUser />
        </SidebarFooter>
        <Cart open={cartOpen} onOpenChange={setCartOpen} />
    </Sidebar>
  )
}