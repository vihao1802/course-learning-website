import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-full h-full flex justify-center items-start">
      <SignUp />
    </main>
  );
}
