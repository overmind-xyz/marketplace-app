"use client";

import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import ItemCard from "@/components/itemCard";
import { getItemById, getItems, getUserWatchListItems } from "@/db/utils";
import { Item, User } from "@/db/schema";
import { SORTS, Sort, valueToSort } from "@/lib/sorting";
import { CATEGORIES, Category, valueToCategory } from "@/lib/categories";

export default function WatchListChart({ seller }: { seller: User }) {
  const [watchListItemIds, setWatchListItemIds] = useState<string[]>([]); // The seller's watch list item ids

  /*
    On page load, get the seller's watch list items and update the state variable accordingly.
  */
  useEffect(() => {
    /*
      Get the seller's watch list items and update the watchListItems state variable.
    */
    getUserWatchListItems(seller.username).then((watchLists) => {
      const itemIds = watchLists.map((watchListItem) => watchListItem.itemId);
      setWatchListItemIds(itemIds);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center py-4">
      {watchListItemIds.length === 0 && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <AlertTriangle className="w-16 h-16 text-yellow-400" />
          <span className="text-xl">No listings found</span>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-full">
        {watchListItemIds
          .map((itemId, index) => (
            <ItemCard itemId={itemId} key={index} />
          ))}
      </div>
    </div>
  );
}
