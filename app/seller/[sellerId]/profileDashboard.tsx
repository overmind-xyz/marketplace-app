import Image from "next/image";
import { Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditProfileModal from "@/components/editProfileModal";
import { Button } from "@/components/ui/button";
import SellerStats from "./sellerStats";
import { User } from "@/db/schema";
import { UserStatus } from "@/lib/types";

export default function ProfileDashboard({
  seller, // The seller to display on the page
  userStatus, // The current user's status
}: {
  seller: User;
  userStatus: UserStatus;
}) {
  return (
    <div className={"flex flex-row justify-center items-center gap-8 mt-8"}>
      {seller.profilePic !== "" ? (
        <Image
          src={seller.profilePic}
          alt=""
          width={150}
          height={150}
          className="rounded-full max-w-[150px] max-h-[150px]"
        />
      ) : (
        <div className="rounded-full w-[150px] h-[150px] bg-yellow-500"></div>
      )}
      <div className="flex flex-col items-center gap-2 py-2">
        <span className="font-semibold self-start">{seller.username}</span>
        <SellerStats seller={seller} />
        {seller.bio !== "" && (
          <ScrollArea className="h-[150px] w-[500px] rounded-md border p-4">
            {seller.bio}
          </ScrollArea>
        )}
        {userStatus === UserStatus.Seller && (
          <EditProfileModal>
            <Button variant="outline" className="text-xs">
              <Pencil className="inline-block w-[12px] h-[12px] mr-2" />
              Edit profile
            </Button>
          </EditProfileModal>
        )}
      </div>
    </div>
  );
}
