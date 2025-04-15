'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function PANavLink({ icon, text, path }) {
  const pathname = usePathname();
  const isActive = pathname === path || pathname.startsWith(`${path}/`);
  console.log(pathname, path, isActive);
  return (
    <Link
      href={path}
      className={`flex items-center space-x-1 px-3 py-1 rounded-md 
        ${isActive ? "active-link bg-primary-dark" : "hover:bg-primary-light"}`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

export default PANavLink;
