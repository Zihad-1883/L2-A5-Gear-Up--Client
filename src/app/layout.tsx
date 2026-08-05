import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { verifyToken } from "@/utilis/jwt";
import { TUser } from "@/app/types/userAuthData.type";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearUp - Sports & Outdoor Gear Rentals",
  description: "Rent top-quality sports equipment and outdoor gear.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const verifiedToken = accessToken ? verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!) : null;
  const user = verifiedToken?.success && verifiedToken.data ? (verifiedToken.data as unknown as TUser) : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors closeButton duration={4000} />
      </body>
    </html>
  );
}
