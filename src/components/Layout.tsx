import React from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const isAuth = session.data?.user;
  return (
    <div className={isAuth ? "bg-base-200" : ""}>
      {isAuth ? (
        <Navbar />
      ) : (
        <nav className="container mx-auto py-4">
          <Link href="/">Logo</Link>
        </nav>
      )}
      <main className="mt-4 min-h-screen">{children}</main>
    </div>
  );
}
