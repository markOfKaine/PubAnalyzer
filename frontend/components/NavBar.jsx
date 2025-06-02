"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

function NavBar() {
  // Nav Routes (Mobile) displayed in the navigation sheet presented by the hamburger menu
  const mainRoutes = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/signin",
      label: "Sign In",
    },
    {
      href: "/signup",
      label: "Sign Up",
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
                className="border border-sidebar-border bg-sidebar text-sidebar-foreground pt-10 flex flex-col justify-between"
              >
                <ul className="flex flex-col gap-2">
                  {mainRoutes.map((route) => (
                    <li key={route.href}>
                      <MobileNavLink href={route.href} icon={route.icon}>
                        {route.label}
                      </MobileNavLink>
                    </li>
                  ))}
                </ul>
                {/* Toggles Light, Dark, System Mode Theme */}
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo and Site Name - Desktop: Left; Mobile: Centered */}
          <div className="col-span-1 md:col-span-2 flex justify-center md:justify-start">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/pubby.png"
                alt="Pubby Logo"
                width={40}
                height={40}
              />
              <span className="text-2xl font-semibold">PubAnalyzer</span>
            </Link>
          </div>

          {/* (Desktop) Navigation Links - Right */}
          <div className="flex justify-end">
            {/* TW - remove the ! to see the avatar logo and drop down menu. Make sure to place it back! */}
            <div className="hidden md:flex items-center gap-2">
              {/* TODO: TW - Add a FAQ page...*/}
              {/* <Link href="/">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-lg"
                >
                  <span>FAQ</span>
                </Button>
              </Link> */}
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-lg"
                >
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="flex items-center gap-2 bg-primary text-lg">
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
