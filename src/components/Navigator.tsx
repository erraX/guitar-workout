"use client";

import { PropsWithChildren } from "react";
import { storage } from "@/storage";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { RiExportLine } from "@remixicon/react";

import { Alumni_Sans } from "next/font/google";

const inter = Alumni_Sans({ subsets: ["latin"] });

export default function Navigator() {
  const pathname = usePathname();
  const isSubRoute = (routerPath: string) => new RegExp(`^${routerPath}`).test(pathname);

  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <p className={`text-2xl font-bold ${inter.className}`}>🎸 WORKOUT</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/workouts">
            <NavButton isActive={isSubRoute('/workouts')}>
              WORKOUTS
            </NavButton>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/exercises">
            <NavButton isActive={isSubRoute('/exercises')}>
              EXERCISES
            </NavButton>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/historys">
            <NavButton isActive={isSubRoute('/history')}>
              HISTORY
            </NavButton>
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          <Popover
            shouldCloseOnBlur
            placement="bottom"
            onOpenChange={(isOpen) => {
              if (isOpen) {
                storage.copyWorkouts();
              }
            }}
          >
            <PopoverTrigger>
              <Button
                isIconOnly
                className="ml-2"
                color="primary"
                variant="ghost"
                size="sm"
              >
                <RiExportLine size="18" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-small">Workouts copied!</div>
            </PopoverContent>
          </Popover>
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
