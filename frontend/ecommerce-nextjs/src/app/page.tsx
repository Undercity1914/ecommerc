import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen min-w-screen overflow-x-hidden flex-col items-center justify-between bg-[#FAFAFA] font-sans dark:bg-black">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex flex-col border-b-2">
            <div className="flex p-4 flex-initial justify-between space-x-3">
              <SidebarTrigger className="cursor-pointer m-1 ml-0" />
              <Navbar />
            </div>
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
