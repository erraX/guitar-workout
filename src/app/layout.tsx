import "@/styles/globals.css";

import { Metadata } from "next";
import { Alumni_Sans } from "next/font/google";
import { Navigator } from "../components/Navigator";
import { Providers } from "./providers";
import { isAuthenticated } from "@/lib/auth";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Guitar workout",
};

const inter = Alumni_Sans({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = await isAuthenticated();

  const showNavigator =
    process.env.NODE_ENV === "development" ? true : isLoggedIn;

  return (
    <html lang="en">
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
      </head>
      <body>
        <Providers>
          <SidebarProvider>
            <div className="w-screen flex flex-row">
              {showNavigator && <Navigator />}
              <main className="pt-5 px-6 flex flex-1">{children}</main>
            </div>
          </SidebarProvider>
        </Providers>
        <Toaster position="top-right" />
        <SpeedInsights />
      </body>
    </html>
  );
}
