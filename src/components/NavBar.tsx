"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoading,
} from "@clerk/nextjs";

import { useUser } from "@clerk/nextjs";

import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { Skeleton } from "./ui/skeleton";

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const NavBar = () => {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className="fixed top-0 z-50 w-full h-[60px] px-6 py-4 bg-slate-700 flex flex-row justify-between items-center">
      <Link href={"/"} className={playfair.className}>
        <h1 className="text-white font-bold text-2xl italic">
          Course Learning
        </h1>
      </Link>
      <ul className="flex flex-row gap-4 text-white font-bold text-lg">
        <li>
          <Link href={"/"} className="hover:text-blue-700">
            Home
          </Link>
        </li>
        <li>
          <Link href={"/course"} className="hover:text-blue-700">
            Your Course
          </Link>
        </li>
      </ul>
      <div className="flex gap-3 items-center">
        <SignedOut>
          <SignUpButton>
            {/* Custom sign up button */}
            <Button
              className="bg-inherit hover:text-blue-700 hover:bg-inherit"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </Button>
          </SignUpButton>
          {/* If signed out then show SignInButton */}
          <SignInButton>
            {/* Custom sign in button */}
            <Button
              className="bg-slate-900 hover:bg-slate-950"
              onClick={() => router.push("/sign-in")}
            >
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          {/* If user signed in then show UserButton */}

          {isSignedIn ? (
            <span className="text-white hidden md:block">
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
      </div>
    </div>
  );
};

export default NavBar;
