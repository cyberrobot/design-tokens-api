import React from "react";
import Navbar from "./Navbar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mt-4 min-h-screen">{children}</main>
    </>
  );
}
