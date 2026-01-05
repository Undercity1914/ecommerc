"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  ShoppingCart,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Wishlist from "./wishlist"
import Cart from "./cart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/dist/client/components/navigation"

export function NavUser({
  user,
}: {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()
  const [logged, setLogged] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [localUser, setLocalUser] = useState<{ name?: string; email?: string; avatar?: string }>({})

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setLogged(true)
      try {
        const payloadBase64 = token.split('.')[1]
        if (payloadBase64) {
          const json = JSON.parse(atob(payloadBase64))
          setLocalUser({
            name: json.firstName || json.name || '',
            email: json.email || '',
            avatar: json.avatar || '',
          })
        }
      } catch (e) {
      }
      (async () => {
        try {
          const res = await fetch('http://localhost:3000/users/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          })
          if (res.status === 401) {
            localStorage.removeItem('token')
            setLogged(false)
            return
          }
          if (!res.ok) return
          const data = await res.json()
          setLocalUser((prev) => ({ ...prev, name: data.name || prev.name, email: data.email || prev.email, avatar: data.avatar || prev.avatar }))
        } catch (e) {
        }
      })()
    } else {
      setLogged(false)
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {logged ? (
            <>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar || localUser.avatar} alt={user?.name || localUser.name} />
                    <AvatarFallback className="rounded-lg">{(user?.name || localUser.name || user?.email || localUser.email || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name || localUser.name}</span>
                    <span className="truncate text-xs">{user?.email || localUser.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar || localUser.avatar} alt={user?.name || localUser.name} />
                      <AvatarFallback className="rounded-lg">{(user?.name || localUser.name || user?.email || localUser.email || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name || localUser.name}</span>
                      <span className="truncate text-xs">{user?.email || localUser.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                    <BadgeCheck />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/orders')}>
                    <CreditCard />
                    Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => setCartOpen(true)}>
                    <ShoppingCart />
                    Carrinho
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => setWishlistOpen(true)}>
                    <Sparkles />
                    Lista de Desejos
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell />
                    Notificações
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </>
          ) : (
            <></>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
      <Wishlist open={wishlistOpen} onOpenChange={setWishlistOpen} />
      <Cart open={cartOpen} onOpenChange={setCartOpen} />
    </SidebarMenu >
  )
}
