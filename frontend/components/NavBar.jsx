"use client";
import { Home, Search, User, Menu, X } from "lucide-react";
import { GiParrotHead } from "react-icons/gi";
import PANavLink from "./PANavLink";
import Link from "next/link";
import { useState } from "react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-primary text-secondary shadow-md sticky top-0 z-50">
      <div className="px-2 md:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-3">
            <GiParrotHead size={40} />
            <span className="text-2xl font-semibold">PubAnalyzer</span>
          </Link>
          
          {/* Desktop NavBar Buttons. *Not visible on mobile. */}
          <div className="hidden md:flex space-x-6">
            <PANavLink
              icon={<Home size={18} />}
              text="Home"
              path="/"
            />
            <PANavLink
              icon={<Search size={18} />}
              text="Analyze"
              path="/analyze"
            />
            <PANavLink
              icon={<User size={18} />}
              text="Sign In"
              path="/signin"
            />
          </div>
          
          {/* Menu button for mobile. Only visible on mobile devices and opens/closes the hamburger menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-primary-dark md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu NavLinks */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-2">
            <PANavLink
              icon={<Home size={18} />}
              text="Home"
              path="/"
            />
            <PANavLink
              icon={<Search size={18} />}
              text="Analyze"
              path="/analyze"
            />
            <PANavLink
              icon={<User size={18} />}
              text="Sign In"
              path="/signin"
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
