import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
// import NavigationMenu from "@/components/template/NavigationMenu";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster, ToasterProps } from "@/components/ui/sonner"
import { GlobalContextProvider } from "@/components/template/GlobalContext";
import BottomStatusBar from "@/components/BottomStatusBar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <DragWindowRegion title="" />
      {/* <NavigationMenu /> */}
      <GlobalContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
        <BottomStatusBar />
      </GlobalContextProvider>
      <Toaster expand={true} theme={"dark" as ToasterProps["theme"]}/>
    </div>
  );
}
