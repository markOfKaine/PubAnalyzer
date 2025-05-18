"use client";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/contexts/UserContext";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout } = useUserContext();
  const { setTheme } = useTheme();

  const userName = useMemo(() => {
    if (!user) return "User";
    console.log(user);
    return user.first_name;
  }, [user]);

  const userEmail = useMemo(() => {
    if (!user) return "";
    return user.email;
  }, [user]);

  const userAvatar = useMemo(() => {
    if (!user) return "?";
    const firstInitial = user.first_name.charAt(0).toUpperCase();
    return firstInitial;
  }, [user]);

  const handleThemeChange = (theme) => (e) => {
    // Stop propagation to prevent event bubbling issues
    e.stopPropagation();
    e.preventDefault();
    setTheme(theme);
  };

  return (
    <SidebarMenu className="">
      <SidebarMenuItem className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip=""
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {userAvatar}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal" inset={false}>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {userAvatar}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="" inset={false}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2" inset={false}>
                  <Sun className="h-[1.0rem] w-[1.0rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.0rem] w-[1.0rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Toggle Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="" align="end">
                    <DropdownMenuItem
                      className=""
                      inset={false}
                      onSelect={handleThemeChange("light")}
                    >
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className=""
                      inset={false}
                      onSelect={handleThemeChange("dark")}
                    >
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className=""
                      inset={false}
                      onSelect={handleThemeChange("system")}
                    >
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="" />
            <DropdownMenuItem
              className=""
              inset={false}
              onClick={logout}
              variant="destructive"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}