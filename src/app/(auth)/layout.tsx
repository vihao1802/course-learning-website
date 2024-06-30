"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <section className="h-full">
      <div className="fixed top-0 z-50 w-full h-[60px] px-12 py-4">
        <Image
          src={"/icons/back.png"}
          alt="Logo Back"
          width={30}
          height={30}
          priority={true}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>
      {children}
    </section>
  );
}
