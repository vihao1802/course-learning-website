"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

import { useUser } from "@clerk/nextjs";
import { AlignCenter } from "lucide-react";

import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import { BookOpenTextIcon, UserRoundCogIcon } from "lucide-react";

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const NavBar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <div className="fixed top-0 z-50 w-full h-[60px] px-2 sm:px-6 py-4 bg-slate-700 flex flex-row justify-between items-center">
      <Link href={"/"} className={playfair.className}>
        <h1 className="text-white font-bold text-2xl italic">
          Course Learning
        </h1>
      </Link>
      <div className="gap-3 items-center hidden md:flex">
        {user && (
          <Link
            href={"/course"}
            className="text-white font-bold px-4 py-2 hover:text-blue-700 "
          >
            Your Course
          </Link>
        )}
        {user && <div className="w-[2px] h-[30px] bg-white"></div>}
        <SignedOut>
          <SignUpButton>
            {/* Custom sign up button */}
            <Button
              className="bg-inherit text-base hover:text-blue-700 hover:bg-inherit"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </Button>
          </SignUpButton>
          {/* If signed out then show SignInButton */}
          <SignInButton>
            {/* If signed out then show SignInButton */
            /* Custom sign in button */}
            <Button
              className="bg-slate-900 text-base hover:bg-slate-950"
              onClick={() => router.push("/sign-in")}
            >
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        {/* If user signed in then show UserButton */}
        {!isOpen && (
          <SignedIn>
            {isSignedIn ? (
              <span className="text-white pl-4 py-2 ">
                <strong> {user.fullName}</strong>
              </span>
            ) : (
              <>
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </>
            )}
            <UserButton afterSignOutUrl={"/"} />
          </SignedIn>
        )}
      </div>
      <div className="text-white ml-auto block md:hidden">
        <Button onClick={() => setIsOpen(!isOpen)} className="p-0">
          <AlignCenter />
        </Button>
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side={"right"}>
          <SheetDescription></SheetDescription>
          <SheetTitle className="text-center">
            <Button className="text-black" onClick={() => router.push("/")}>
              <h1 className="font-bold text-2xl italic">Course Learning</h1>
            </Button>
          </SheetTitle>

          <div className="flex flex-col h-full pb-10 pt-2 justify-start border-t-2">
            {user && (
              <SheetClose asChild>
                <Button
                  className="col-span-2 text-black p-0 justify-start"
                  onClick={() => router.push("/course")}
                >
                  <h1 className="flex flex-row items-center gap-2 font-semibold text-lg hover:text-blue-700 ">
                    <BookOpenTextIcon />
                    Your Course
                  </h1>
                </Button>
              </SheetClose>
            )}
            {user && (
              <SheetClose asChild>
                <Button
                  className="col-span-2 text-black p-0 justify-start"
                  onClick={() => router.push("/user-profile")}
                >
                  <h1 className="flex flex-row items-center gap-2 font-semibold w-full text-lg hover:text-blue-700">
                    <UserRoundCogIcon />
                    Your profile
                  </h1>
                </Button>
              </SheetClose>
            )}
            <div className="col-span-2 mt-auto flex flex-col gap-4">
              <SignedOut>
                <SignUpButton>
                  {/* Custom sign up button */}
                  <Button
                    className="text-slate-900 border-2 border-slate-900 text-base hover:text-blue-700 hover:bg-inherit"
                    onClick={() => router.push("/sign-up")}
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
                {/* If signed out then show SignInButton */}
                <SignInButton>
                  {/* If signed out then show SignInButton */
                  /* Custom sign in button */}
                  <Button
                    className="bg-slate-900 text-base hover:bg-slate-950"
                    onClick={() => router.push("/sign-in")}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <SheetClose asChild>
                  <SignOutButton>
                    <button className="py-1 rounded-md border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                      Sign out
                    </button>
                  </SignOutButton>
                </SheetClose>
              </SignedIn>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavBar;
