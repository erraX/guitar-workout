"use client";

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
import { RiExportLine } from "@remixicon/react";

import { Alumni_Sans } from "next/font/google";

const inter = Alumni_Sans({ subsets: ["latin"] });

export default function Navigator() {
  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <p className={`text-2xl font-bold ${inter.className}`}>🎸 WORKOUT</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="foreground" href="#">
            <Button variant="flat" color="primary">
              WORKOUTS
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" aria-current="page">
            <Button variant="light" color="primary">
              EXERCISES
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#" aria-current="page">
            <Button variant="light" color="primary">
              HISTORY
            </Button>
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
