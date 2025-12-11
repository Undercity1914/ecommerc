import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Navbar() {
  return (
    <div className="w-screen overflow-x-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="w-full p-2 flex flex-col tracking-wide">
            <div className="flex justify-between pb-4 pt-2 border-b">
              <SidebarTrigger />
              <h1 className="font-bold text-2xl">Ecommerce App</h1>
              <div/>
            </div>
            <nav className="flex justify-between p-2 space-x-2">
              <Button variant={"ghost"} className="bg-black text-white cursor-pointer">Pesquisar Produto</Button>
              <Input 
                type="text"
                placeholder="Pesquisar Produto"
                className="flex-1 min-w-0 bg-white"
              />
              <Button variant={"ghost"} className="bg-black text-white cursor-pointer">Entrar</Button>
              <Button variant={"ghost"} className="bg-black text-white cursor-pointer">Cadastrar-se</Button>
            </nav>
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
