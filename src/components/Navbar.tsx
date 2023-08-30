import Link from "next/link";
import Dropdown from "./Dropdown";
import { signOut, useSession } from "next-auth/react";

import { type Session } from "next-auth";
import Logo from "./Logo";

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
  const accountItems = [
    {
      label: "Sign out",
      value: "signout",
    },
  ];
  const handleAccountSelect = (items: typeof accountItems) => {
    if (items[0] && items[0].value === "signout") {
      signOut().catch(console.error);
    }
  };

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
        <Dropdown<(typeof accountItems)[0]>
          placeholder="ACCOUNT"
          value={accountItems}
          labelBy="label"
          size="sm"
          onSelect={handleAccountSelect}
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
