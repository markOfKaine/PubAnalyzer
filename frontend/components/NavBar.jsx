"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, UserPlus } from "lucide-react";
import { GiParrotHead } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "@/components/ModeToggle";

// Navigation link components for mobile and desktop
const MobileNavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="flex items-center gap-2 w-full justify-start rounded-none"
      >
        <span>{children}</span>
      </Button>
    </Link>
  );
};

const DesktopNavLink = ({ href, children }) => {
  return (
    <Link href={href}>
      <Button variant="ghost" className="flex items-center gap-2 text-base">
        <span>{children}</span>
      </Button>
    </Link>
  );
};

const AvatarDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          {/* TODO: TW - Replace once user logic is implemented */}
          <AvatarImage src="/" alt="User" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {/* TODO: TW - Replace with proper path once sign out logic is handled. */}
          <Link href="/sigin" className="cursor-pointer">
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function NavBar() {
  // TODO: TW - Update when sign in logic is implemented
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Nav Routes (Desktop) displayed in the navigation bar - left side
  const mainRoutes = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/analyze",
      label: "Analyze",
    },
  ];

  // Nav Routes (Mobile) - varies depending on if signed in or not
  // TODO: TW - Update Routes once sign in logic is implemented
  const authRoutes = !isAuthenticated
    ? [
        {
          href: "/signin",
          label: "Sign In",
        },
        {
          href: "/",
          label: "Sign Up",
        },
      ]
    : [
        {
          href: "/",
          label: "Profile",
        },
        {
          href: "/",
          label: "Sign Out",
        },
      ];

  return (
    <nav className="bg-background border-b rounded-b-lg border-border shadow-md sticky top-0 z-50">
      <div className="px-2 md:px-8 py-3">
        <div className="grid grid-cols-3 items-center">
          {/* Left area with hamburger menu (mobile only) */}
          <div className="md:hidden flex justify-start">
            {/* Mobile Hamburger Menu - hidden on desktop */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-secondary-foreground"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="border border-sidebar-border bg-sidebar text-sidebar-foreground pt-10 w-[400px] sm:w-[540px] flex flex-col justify-between"
              >
                <ul className="flex flex-col gap-2">
                  {mainRoutes.concat(authRoutes).map((route) => (
                    <li key={route.href}>
                      <MobileNavLink href={route.href} icon={route.icon}>
                        {route.label}
                      </MobileNavLink>
                    </li>
                  ))}
                </ul>
                {/* Toggles Light, Dark, System Mode Theme */}
                <div className="mt-4 border-t border-sidebar-border p-4 flex justify-end">
                  <ModeToggle />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo and Site Name - Desktop: Left; Mobile: Centered */}
          <div className="col-span-1 md:col-span-2 flex justify-center md:justify-start">
            <Link href="/" className="flex items-center space-x-3">
              <GiParrotHead size={40} className="text-primary" />
              <span className="text-2xl font-semibold">PubAnalyzer</span>
            </Link>

            {/* Left-side Navigation Links (desktop only) */}
            <ul className="hidden md:flex items-center ml-6 gap-2">
              {mainRoutes.map((route) => (
                <li key={route.href}>
                  <DesktopNavLink href={route.href}>
                    {route.label}
                  </DesktopNavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* (Desktop) Navigation Links - Right */}
          <div className="flex justify-end">
            {/* TW - remove the ! to see the avatar logo and drop down menu. Make sure to place it back! */}
            {isAuthenticated ? (
              <AvatarDropDown />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <ModeToggle />
                <Link href="/signin">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User size={18} />
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button
                    className="flex items-center gap-2 bg-primary text-background"
                  >
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
