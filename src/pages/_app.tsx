import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Alumni_Sans } from 'next/font/google'
import {
  NextUIProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react';

const inter = Alumni_Sans({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <div className="w-page m-auto">
        <Navbar maxWidth="full">
          <NavbarBrand>
            <p className={`text-2xl font-bold ${inter.className}`}>🎸 WORKOUT</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem isActive>
              <Link color="foreground" href="#">
                Workouts
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" aria-current="page">
                Exercises
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" aria-current="page">
                History
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex" />
          </NavbarContent>
        </Navbar>
        <main className="pt-5 px-6 flex">
          <Component {...pageProps} />
        </main>
      </div>
    </NextUIProvider>
  );
}
