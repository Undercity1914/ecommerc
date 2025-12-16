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
    }
]

export function AppSidebar() {
  return (
    <Sidebar>
        <SidebarHeader/>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Ecommerce app</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url}>
                                        <item.icon/>
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        
                    </SidebarMenu>
                    
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="pb-20">
            <NavUser user={users.user}/>
        </SidebarFooter>
    </Sidebar>
  )
}