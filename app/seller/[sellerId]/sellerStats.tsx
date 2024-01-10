"use client";

import { useEffect, useState } from "react";
import {
  getNumberOfRatingsForTarget,
  getStarsForTarget,
  getUserNumberOfPurchases,
  getUserNumberOfSales,
} from "@/db/utils";
import { User } from "@/db/schema";
import { Star } from "lucide-react";

export default function SellerStats({ seller }: { seller: User }) {
  const [numberOfSales, setNumberOfSales] = useState(0); // The number of sales the seller has made
  const [numberOfPurchases, setNumberOfPurchases] = useState(0); // The number of purchases the seller has made
  const [stars, setStars] = useState<number | null>(null); // The seller's average rating
  const [ratingCount, setRatingCount] = useState(0); // The number of ratings the seller has received

  /*  
    On page load and when the seller changes, get the seller's stats and update the state variables 
    accordingly.
  */
  useEffect(() => {
    /* 
      TODO: Get and update the seller's stats. 
      - The number of sales the seller has made
      - The number of purchases the seller has made
      - The seller's average rating
      - The number of ratings the seller has received
    */
    
  }, [seller]);

  return (
    <div className="flex flex-row justify-center items-center mb-1">
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {numberOfSales} Sales
      </span>
      <span className="text-sm text-gray-500 mx-2">•</span>
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {numberOfPurchases} Purchases
      </span>
      <span className="text-sm text-gray-500 mx-2">•</span>
      {stars == null ? (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          No reviews yet
        </span>
      ) : (
        <div className="text-sm text-gray-500 flex flex-row gap-2 items-center">
          <div className="flex flex-row">
            {[1, 2, 3, 4, 5].map((i) => {
              return (
                <Star
                  key={i}
                  size={13}
                  className={
                    i <= Math.round(stars)
                      ? "text-gray-500 fill-gray-500"
                      : "text-gray-500"
                  }
                />
              );
            })}
          </div>
          <span>({ratingCount})</span>
        </div>
      )}
    </div>
  );
}
