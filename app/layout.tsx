import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import Canvas from "@/components/Canvas";
import { ToolProvider } from "@/context/ToolContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Canvas",
  description: "Drawing canvas web app",
  icons: {
    icon: '/draw.svg',
    shortcut: "/draw.svg",
    apple: "/draw.svg"
  },
};

export default function RootLayout({
  // children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen overflow-hidden bg-white dark:bg-black scroll-smooth selection:bg-blue-600 selection:text-neutral-200  antialiased`}
      >
        {/* <TopMenu/> */}
        {/* <Canvas/> */}
        {/* {children} */}


        <ToolProvider>
          <div className="relative w-full h-full">
            <TopMenu />
            <div className="absolute  left-0 w-full h-[100vh]">
              <Canvas />
            </div>
          </div>
        </ToolProvider>







      </body>
    </html>
  );
}
