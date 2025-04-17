"use client";

import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

/**
 * PageWrapper component that handles consistent page layout and scrolling behavior.
 * 
 * @param fullHeight - Set to true to make the page take up the full viewport height minus the navbar
 *                    and prevent page scrolling. Content within will need its own scrolling.
 */
export default function PageWrapper({ 
  children, 
  fullHeight = false 
}: PageWrapperProps) {
  return (
    <div 
      className={`w-full ${
        fullHeight 
          ? "h-[calc(100vh-64px)] overflow-hidden" 
          : "min-h-[calc(100vh-64px)]"
      }`}
    >
      {children}
    </div>
  );
} 