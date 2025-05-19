"use client";
import { useState } from "react";
import { Home, Search, Files } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter, usePathname } from "next/navigation";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePMContext } from "@/contexts/PubMedContext";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: false,
    },
    {
      title: "EX-Viewer",
      url: "/viewer",
      icon: Files,
      isActive: false,
    },
    {
      title: "Discover",
      url: "/discover",
      icon: Search,
      isActive: false,
    },
  ],
};

const hasSideBarTrigger = ["/viewer"];

function AppSidebar() {
  const [activeItem, setActiveItem] = useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { pdfURL } = usePMContext();

  const showSideBarTrigger = hasSideBarTrigger.includes(pathname) && pdfURL;

  return (
    <>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarContent className="">
          <SidebarGroup className="">
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="">
                {data.navMain.map((item) => (
                  <SidebarMenuItem className="" key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        className: "text-sidebar-foreground",
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        router.push(item.url);
                        // TW - Can make certain menu items open the bar if needed
                        // setOpen(true);
                      }}
                      isActive={pathname === item.url}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <Separator className="my-4"/>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="">
          {showSideBarTrigger && (
            <SidebarMenuItem className="">
              <SidebarMenuButton
                tooltip=""
                size="lg"
                asChild
                className="md:h-8 md:p-0"
              >
                <SidebarTrigger
                  className="flex aspect-square size-8 items-center justify-center bg-sidebar-accent"
                  onClick={() => console.log("Sidebar triggered")}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

export default AppSidebar;
