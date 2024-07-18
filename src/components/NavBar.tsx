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
  useAuth,
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
  const { isSignedIn, user } = useUser();

  return (
    <div className="fixed top-0 z-50 w-full h-[60px] px-6 py-4 bg-slate-700 flex flex-row justify-between items-center">
      <Link href={"/"} className={playfair.className}>
        <h1 className="text-white font-bold text-2xl italic">
          Course Learning
        </h1>
      </Link>
      <div className="flex gap-3 items-center">
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
        {/* {isSignedIn ? (
          <SignedIn>
            <span className="text-white hidden md:block">
              <strong> {user.fullName}</strong>
            </span>
            <UserButton afterSignOutUrl={"/"} />
          </SignedIn>
        ) : (
          <>
            {isSignedIn === undefined ? (
              <>
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </>
            ) : (
              
            )}
          </>
        )} */}

        {/* If user signed in then show UserButton */}
        <SignedIn>
          {isSignedIn ? (
            <span className="text-white pl-4 py-2 hidden md:block">
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
