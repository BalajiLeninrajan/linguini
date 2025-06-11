import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Pacifico } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { LinguiniStyles } from "~/styles/styles";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${pacifico.variable}`}>
      <body className={`min-h-screen ${LinguiniStyles.backgrounds.page} font-inter`}>
        <TRPCReactProvider>
          <div className="min-h-screen flex flex-col">
            <header className={`${LinguiniStyles.backgrounds.header} ${LinguiniStyles.header.container}`}>
              <h1 className={LinguiniStyles.header.title} style={LinguiniStyles.header.titleFont}>
                linguini
              </h1>
            </header>
            <main className="flex-1 pt-4">
              {children}
            </main>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
