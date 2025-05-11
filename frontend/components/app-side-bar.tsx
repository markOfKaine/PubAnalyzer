"use client";
import ModeToggle from "@/components/ModeToggle";
import * as React from "react";
import { Home, Search, Trash2, File  } from "lucide-react";
import { GiParrotHead } from "react-icons/gi";
import { useRouter } from 'next/navigation'
import { NavUser } from "@/components/NavSidebar";
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

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: false,
    },
    {
      title: "Analyze",
      url: "/analyze",
      icon: Search,
      isActive: false,
    },
    {
      title: "Files",
      url: "#",
      icon: File,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
  ],
};

function AppSidebar() {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  const router = useRouter();

  return (
    <>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader className="">
          <SidebarMenu className="border-b border-sidebar-border pb-4 space-y-2">
            <SidebarMenuItem className="">
              <SidebarMenuButton
                tooltip=""
                size="lg"
                asChild
                className="md:h-8 md:p-0"
              >
                <SidebarTrigger
                  className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary"
                  onClick={() => console.log("Sidebar triggered")}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="">
              <SidebarMenuButton
                tooltip=""
                size="md"
                asChild
                className="flex aspect-square size-8 items-center justify-center bg-green-500"
              >
                <GiParrotHead />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="">
          <SidebarGroup className="">
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="">
                {data.navMain.map((item) => (
                  <SidebarMenuItem className="" key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        router.push(item.url);
                        // TW - Can make certain menu items open the bar if needed
                        // setOpen(true);
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="">
          <NavUser user={data.user} />
          <ModeToggle />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

export default AppSidebar;
