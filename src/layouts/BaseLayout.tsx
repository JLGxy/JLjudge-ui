import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
// import NavigationMenu from "@/components/template/NavigationMenu";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { GlobalContextProvider } from "@/components/template/GlobalContext";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DragWindowRegion title="electron-shadcn" />
      {/* <NavigationMenu /> */}
      <GlobalContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </GlobalContextProvider>
      <Toaster expand={true} />
    </div>
  );
}
