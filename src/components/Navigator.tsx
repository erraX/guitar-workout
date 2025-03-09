"use client";

import Link from "next/link";
import { Alumni_Sans } from "next/font/google";
import { usePathname } from "next/navigation";

import {
  Calendar,
  ListChecks,
  Dumbbell,
  Plus,
  LayoutDashboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/components/ui/sidebar";

const inter = Alumni_Sans({ subsets: ["latin"] });

const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Workouts",
    url: "/workouts",
    icon: Dumbbell,
  },
  {
    title: "Exercises",
    url: "/exercises",
    icon: ListChecks,
    subItems: [
      {
        title: "Create",
        url: "/exercises/create",
        icon: Plus,
      },
    ],
  },
  {
    title: "Historys",
    url: "/historys",
    icon: Calendar,
  },
];

export function Navigator() {
  const pathname = usePathname();
  const isSubRoute = (routerPath: string) =>
    new RegExp(`^${routerPath}`).test(pathname);

  return (
    <Sidebar>
      <SidebarHeader>
        <p className={`text-2xl font-bold ${inter.className}`}>
          🎸 GUITAR WORKOUT
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isSubRoute(item.url)}
                    className="h-10"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubRoute(subItem.url)}
                            className="h-10"
                          >
                            <Link href={subItem.url}>
                              <subItem.icon />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
