import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  NextUIProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from '@nextui-org/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <div className="w-page m-auto">
        <Navbar maxWidth="full">
          <NavbarBrand>
            <p className="font-bold text-inherit">🎸GW</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="start">
            <NavbarItem>
              <Link color="foreground" href="/workouts">
                Workouts
              </Link>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
        <main className="pt-5 flex">
          <Component {...pageProps} />
        </main>
      </div>
    </NextUIProvider>
  );
}
