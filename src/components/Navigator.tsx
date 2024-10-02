"use client";

import { PropsWithChildren } from "react";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";

import { Alumni_Sans } from "next/font/google";

const inter = Alumni_Sans({ subsets: ["latin"] });

export default function Navigator() {
  const pathname = usePathname();
  const isSubRoute = (routerPath: string) =>
    new RegExp(`^${routerPath}`).test(pathname);

  return (
    <Navbar maxWidth="full">
      <NavbarBrand className="grow-0 mr-5">
        <p className={`text-2xl font-bold ${inter.className}`}>🎸 WORKOUT</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-2">
        <NavbarItem>
          <Link href="/workouts">
            <NavButton isActive={isSubRoute("/workouts")}>WORKOUTS</NavButton>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/exercises">
            <NavButton isActive={isSubRoute("/exercises")}>EXERCISES</NavButton>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/historys">
            <NavButton isActive={isSubRoute("/history")}>HISTORY</NavButton>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

function NavButton({ children, isActive }: PropsWithChildren<{ isActive?: boolean }>) {
  const variant = isActive ? 'flat' : 'light';
  return (
    <Button variant={variant} color="primary">
      {children}
    </Button>
  );
}
