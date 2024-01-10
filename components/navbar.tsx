"use client";

import ProfileButton from "./profileButton";
import SearchBar from "./searchBar";
import CreateListingModal from "./createListingModal";
import CartButton from "./cartButton";
import { SessionProvider, useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  return (
    <SessionProvider>
      <div className="w-full h-full flex flex-row justify-start gap-2 items-center">
        <div className="w-[300px] px-8">
          <a className="" href="/">
            <div className="flex">
              <Image
                src="/marketplace-logo.png"
                alt="Marketplace"
                height={44}
                width={44}
                className="inline mr-2"
              />
              <span className="inline-block text-2xl text-white font-avenir pt-2 ">
                Marketplace
              </span>
            </div>
          </a>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <SearchBar />
        </div>

        <div className="flex flex-row justify-end px-8 gap-2">
          <CreateListingModal />
          <ProfileButton />
          <CartButton />
        </div>
      </div>
    </SessionProvider>
  );
}
