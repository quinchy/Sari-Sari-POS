import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-slant">
      <div className="w-screen h-screen absolute bg-muted/25 z-10" />
      <SidebarProvider>
        <AppSidebar />
        <main className="my-2 p-4 w-full mr-2 rounded-lg shadow-md bg-card border z-10">
          {children}
        </main>
      </SidebarProvider>
    </main>
  );
}
