import Link from "next/link";
import Dropdown from "./Dropdown";
import { signOut, useSession } from "next-auth/react";

import { type Session } from "next-auth";
import Logo from "./Logo";
import { useRouter } from "next/router";
import { type SyntheticEvent } from "react";

function AccountDropdownHeader({ user }: { user: Session["user"] }) {
  return (
    <div className="mb-2 border-b-[1px] border-neutral px-4 pb-2 pt-1 text-gray-500">
      Signed in as{" "}
      <span className="font-bold text-neutral-content">{user.email}</span>
    </div>
  );
}

export default function Navbar() {
  const session = useSession();
  const router = useRouter();
  const accountItems = [
    {
      label: "Settings",
      value: "settings",
      href: "/account/settings",
    },
    {
      label: "Sign out",
      value: "signout",
      onClick: (e: SyntheticEvent) => {
        e.preventDefault();
        signOut().catch(console.error);
      },
    },
  ];

  const accountItemComponents = accountItems.map((item, index) => {
    if (item.value === "signout") {
      return (
        <span key={`link-${index}`} onClick={item.onClick} className="w-full">
          {item.label}
        </span>
      );
    }
    return (
      <Link key={`link-${index}`} href={item.href || "/"}>
        {item.label}
      </Link>
    );
  });

  return (
    <nav className="container mx-auto flex justify-between py-6">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex gap-1">
        <Link href="/tokens">
          <button className="btn-ghost btn-sm btn hover:btn-primary">
            Tokens
          </button>
        </Link>
        <Dropdown<(typeof accountItemComponents)[0]>
          placeholder="ACCOUNT"
          value={accountItemComponents}
          size="sm"
          persistPlaceholder={true}
          header={
            session.data?.user && (
              <AccountDropdownHeader user={session.data?.user} />
            )
          }
          direction="right"
          type="ghost"
          className="hover:btn-primary"
        />
      </div>
    </nav>
  );
}
