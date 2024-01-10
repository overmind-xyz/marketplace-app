"use client";

import ProfileDashboard from "./profileDashboard";
import ProfileData from "./profileData";
import WithdrawModal from "@/components/withdrawModal";
import { User } from "@/db/schema";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUser } from "@/db/utils";
import { UserStatus } from "@/lib/types";

export default function ProfilePageContent({ seller }: { seller: User }) {

  const { data: session, status } = useSession(); // The current user's session
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.Visitor); // The current user's status

  /*
    On page load, get the current user's session and update the state variables accordingly.
  */
  useEffect(() => {
    if (session && session.user?.name) {
      getUser(session.user.name).then((user) => {
        if (user) {
          if (user.username === seller.username) {
            setUserStatus(UserStatus.Seller);
          } else {
            setUserStatus(UserStatus.Buyer);
          }
        }
      });
    }
    
  }, [session, status]);

  return (
    <div className="w-full h-full px-4">
      <WithdrawModal />
      <ProfileDashboard seller={seller} userStatus={userStatus} />
      <ProfileData seller={seller} userStatus={userStatus} />
    </div>
  );
}
