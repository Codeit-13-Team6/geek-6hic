import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Gnb } from "@/components/layout/Gnb";
import { ToasterProvider } from "@/providers/ToasterProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { MemberProvider } from "@/providers/MemberProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "co-git", template: "%s | co-git" },
  description:
    "코드잇 스프린터 수강생 전용 온/오프라인 모임 매칭 및 소통 플랫폼",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "co-git",
    description:
      "코드잇 스프린터 수강생 전용 온/오프라인 모임 매칭 및 소통 플랫폼",
    images: ["/img/logo/cogit.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-background text-foreground font-pretendard antialiased"
        suppressHydrationWarning
      >
        <QueryProvider>
          <MemberProvider>
            <Gnb />

            <ToasterProvider />
            <main className="mx-auto w-full max-w-[1200px] px-6 py-8 sm:px-8 lg:py-20">
              {children}
            </main>
          </MemberProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
