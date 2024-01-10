"use client";

import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ListingChart from "./listingChart";
import PurchaseChart from "./purchaseChart";
import SaleChart from "./saleChart";
import ReviewListForTarget from "../../../components/reviewListForTarget";
import ReviewListForAuthor from "@/components/reviewListForAuthor";
import WatchListChart from "./watchListChart";
import { User } from "@/db/schema";
import { UserStatus } from "@/lib/types";

export default function ProfileData({
  seller, // The seller to display on the page
  userStatus, // The current user's status
}: {
  seller: User;
  userStatus: UserStatus;
}) {
  const [activeTab, setActiveTab] = useState("listings"); // The currently active tab

  const urlParams = useSearchParams(); // The URL parameters

  /*
    On page load, if the URL contains a tab parameter, update the active tab accordingly.
  */
  useEffect(() => {
    /* 
      Fetch the `tab` parameter from the URL and update the active tab accordingly. 
      If the `tab` parameter is not present, default to the `listings` tab.
    */
      if (urlParams.get("tab")) {
        setActiveTab(urlParams.get("tab") || "listings");
      }
  
      /*
        Remove the `tab` parameter from the URL.
      */
      window.history.replaceState(null, "", window.location.pathname); // remove URL fragment
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <div className="w-[1200px] h-[700px] mt-4">
        <div className="w-full flex flex-col items-center justify-start">
          <div className="flex flex-row justify-center gap-2">
            <div
              className={`cursor-pointer p-2 ${
                activeTab === "listings" ? "text-yellow-400" : ""
              }`}
              onClick={() => setActiveTab("listings")}
            >
              Listings
            </div>
            {userStatus === UserStatus.Seller && (
              <div
                className={`cursor-pointer p-2 ${
                  activeTab === "purchases" ? "text-yellow-400" : ""
                }`}
                onClick={() => setActiveTab("purchases")}
              >
                Purchases
              </div>
            )}
            {userStatus === UserStatus.Seller && (
              <div
                className={`cursor-pointer p-2 ${
                  activeTab === "activity" ? "text-yellow-400" : ""
                }`}
                onClick={() => setActiveTab("activity")}
              >
                Sales
              </div>
            )}
            {userStatus === UserStatus.Seller && (
              <div
                className={`cursor-pointer p-2 ${
                  activeTab === "watch list" ? "text-yellow-400" : ""
                }`}
                onClick={() => setActiveTab("watch list")}
              >
                Watch List
              </div>
            )}
            <div
              className={`cursor-pointer p-2 ${
                activeTab === "reviews" ? "text-yellow-400" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </div>
            {userStatus === UserStatus.Seller && (
              <div
                className={`cursor-pointer p-2 ${
                  activeTab === "your reviews" ? "text-yellow-400" : ""
                }`}
                onClick={() => setActiveTab("your reviews")}
              >
                Your Reviews
              </div>
            )}
          </div>
          <Separator className="w-full" />
        </div>
        {activeTab === "listings" && <ListingChart seller={seller} />}
        {activeTab === "purchases" && <PurchaseChart seller={seller} />}
        {activeTab === "activity" && <SaleChart seller={seller} />}
        {activeTab === "watch list" && <WatchListChart seller={seller} />}
        {activeTab === "reviews" && (
          <ReviewListForTarget target={seller.username} />
        )}
        {activeTab === "your reviews" && (
          <ReviewListForAuthor author={seller.username} />
        )}
      </div>
    </div>
  );
}
