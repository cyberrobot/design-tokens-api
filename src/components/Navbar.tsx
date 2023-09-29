import Link from "next/link";
import Dropdown from "./Dropdown";
import { signOut, useSession } from "next-auth/react";

import { type Session } from "next-auth";
import Logo from "./Logo";
import { type SyntheticEvent } from "react";

function AccountDropdownHeader({ user }: { user: Session["user"] }) {
  return (
    <div className="border-b-[1px] border-neutral px-6 py-2 text-gray-500">
      Signed in as{" "}
      <span className="font-bold text-neutral-content">{user.email}</span>
    </div>
  );
}

export default function Navbar() {
  const session = useSession();
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
  const AccountItemComponents = () => (
    <>
      {accountItems.map((item, index) => {
        if (item.value === "signout") {
          return (
            <span
              key={`link-${index}`}
              onClick={item.onClick}
              className="w-full"
            >
              {item.label}
            </span>
          );
        }
        return (
          <Link key={`link-${index}`} href={item.href || "/"}>
            {item.label}
          </Link>
        );
      })}
    </>
  );

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
        <Dropdown<typeof AccountItemComponents>
          placeholder="ACCOUNT"
          header={
            <AccountDropdownHeader
              user={session.data?.user as Session["user"]}
            />
          }
          items={<AccountItemComponents />}
          size="sm"
          persistPlaceholder={true}
          closeOnSelect={true}
          direction="right"
          type="ghost"
          className="hover:btn-primary"
        />
      </div>
    </nav>
  );
}
