import { SignUp } from "@clerk/nextjs";

export async function generateStaticParams() {
  return [{ params: { "sign-up": [] } }];
}

export default function Page() {
  return (
    <main className="w-full h-full flex justify-center items-start">
      <SignUp />
    </main>
  );
}
