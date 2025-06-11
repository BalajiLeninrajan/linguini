import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Pacifico } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});


export const LinguiniStyles = {
  backgrounds: {
    header: "bg-[#F0D080]",
    page: "bg-[#FCF1D4]",
    input: "bg-white/50",
  },
  header: {
    container: "w-full py-5 px-8 sticky top-0 z-50",
    title: "text-center text-[#7A532A]",
    titleFont: {
      fontFamily: "var(--font-pacifico)",
      fontSize: "5rem"
    }
  },
  game: {
    timer: "text-6xl mb-20 text-center tracking-wider text-[#CA934A]",
    category: "text-3xl text-center mb-12",
    categoryText: "text-[#CA934A]",
    count: "text-4xl font-bold text-[#7A532A]",
    label: "text-[#666666]",
  },
  layout: {
    pageContainer: "flex flex-col items-center px-4 pt-16 max-w-2xl mx-auto",
    countsContainer: "flex justify-center gap-40 mb-20 w-full",
    countBox: "text-center",
    inputContainer: "w-full max-w-lg flex flex-col items-center gap-4",
  },
  input: {
    default: `w-full h-14 px-6 rounded-3xl bg-white/50 
              text-center text-lg font-inter text-[#888888]
              border border-[#888888]/20 placeholder-[#888888]/60
              focus:outline-none focus:border-[#7A532A]`,
  },
  button: {
    default: "bg-[#8E6329] text-white px-8 py-3 rounded-3xl hover:bg-opacity-90 transition-colors w-full h-14 text-lg",
  }
};

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
