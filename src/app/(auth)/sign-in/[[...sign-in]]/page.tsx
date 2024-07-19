import { SignIn } from "@clerk/nextjs";

export async function generateStaticParams() {
  return [{ params: { "sign-in": [] } }];
}

export default function Page() {
  return (
    <main className="w-full h-full flex justify-center items-start">
      <SignIn />
    </main>
  );
}
