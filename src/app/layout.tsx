import "@/styles/globals.css";

import { Metadata } from "next";
import { Alumni_Sans } from "next/font/google";
import Navigator from "../components/Navigator";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Guitar workout",
};

const inter = Alumni_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>
      <body>
        <Providers>
          <div className="max-w-page min-w-page m-auto">
            <Navigator />
            <main className="pt-5 px-6 flex">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
