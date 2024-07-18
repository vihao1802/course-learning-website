import NavBar from "@/components/NavBar";
import NextTopLoader from "nextjs-toploader";

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <NavBar />
      <NextTopLoader showSpinner={false} speed={200} />
      {children}
    </section>
  );
}
