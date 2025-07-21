"use client";
import Image from "next/image";

export default function Header() {
  return (
    <div className="absolute z-5 flex w-full justify-center bg-[#F6CF81] p-4">
      <Image src="/linguini.svg" alt="Linguini" width={250} height={250} />
      <Image
        src="/pasta.svg"
        alt="Linguini"
        width={250}
        height={200}
        className="absolute top-24 left-0 hidden sm:block"
      />
    </div>
  );
}
