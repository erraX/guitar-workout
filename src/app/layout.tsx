import "@/styles/globals.css";

import { Metadata } from "next";
import { Alumni_Sans } from "next/font/google";
import Navigator from "../components/Navigator";
import { Providers } from "./providers";
import { isAuthenticated } from "@/lib/auth";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

  return (
    <html lang="en">
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
      </head>
      <body>
        <Providers>
          <div className="max-w-page min-w-page m-auto">
            {isLoggedIn && <Navigator />}
            <main className="pt-5 px-6 flex">{children}</main>
          </div>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
