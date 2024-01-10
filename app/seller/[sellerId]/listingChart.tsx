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
import { getItems } from "@/db/utils";
import { Item, User } from "@/db/schema";
import { SORTS, Sort, valueToSort } from "@/lib/sorting";
import { CATEGORIES, Category, valueToCategory } from "@/lib/categories";

/* 
  This ListingChart component is loaded on the client side and is responsible for retrieving
  and displaying the listings for a given seller.
*/
export default function ListingChart({ seller }: { seller: User }) {
  const [items, setItems] = useState<Item[]>([]); // The seller's listings 

  const [sorting, setSorting] = useState<Sort | null>(null); // The sorting method
  const [category, setCategory] = useState<Category | null>(null); // The category
  const [listed, setListed] = useState<boolean>(true); // Whether to show listed or unlisted items

  const [pageNumber, setPageNumber] = useState(1); // The current page number
  const [pageSize] = useState(10); // The number of items per page

  /* 
    On page load and whenever the sorting, category, or listed state changes, get the items.
  */
  useEffect(() => {
    /* 
      TODO: Get the items with the given parameters and update the items state.
      HINT: Use the following parameters:
        - user: The seller's username
        - sort: The sorting method
        - category: The category
        - listed: Whether to show listed or unlisted items
    */
    
  }, [sorting, category, listed, seller]);

  return (
    <div className="flex flex-col gap-4 items-center py-4">
      <div className="w-full flex flex-row items-center justify-between gap-4 px-4">
        <div></div>
        <div className="flex flex-row gap-2">
          <Select
            value={listed ? "listed" : "unlisted"}
            onValueChange={(value) => {
              setListed(value === "listed");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Show listed or unlisted items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="listed">Listed</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={category?.value}
            onValueChange={(value) => {
              if (value === category?.value) {
                setCategory(null);
              } else {
                setCategory(valueToCategory(value));
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem value={category.value} key={category.value}>
                  {category.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sorting?.value}
            onValueChange={(value) => {
              if (value === sorting?.value) {
                setSorting(null);
              } else {
                setSorting(valueToSort(value));
              }
            }}
          >
            <SelectTrigger className="w-[180px] focus-visible:ring-0 focus:ring-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((sort) => (
                <SelectItem value={sort.value} key={sort.value}>
                  {sort.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {
        /*
          TODO: If there are no items, display the provided loading message. 
          ```
          <div className="flex flex-col justify-center items-center w-full h-full">
            <AlertTriangle className="w-16 h-16 text-yellow-400" />
            <span className="text-xl">No listings found</span>
          </div>
          ```
        */
      }
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-full">
        {
          /*
            TODO: Paginate the items and map over each item and return an ItemCard component with the itemId prop set to the item's id.
          */
          "PLACEHOLDER"
        }
      </div>
      <div className="flex flex-row justify-center items-center gap-4">
        {pageNumber > 1 && (
          <div
            className="flex flex-row justify-center items-center gap-4 cursor-pointer"
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <ChevronLeft />
            <span>{pageNumber - 1}</span>
          </div>
        )}
        <span className="underline underline-offset-4">{pageNumber}</span>
        {items.length > pageNumber * pageSize && (
          <div
            className="flex flex-row justify-center items-center gap-4 cursor-pointer"
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <span>{pageNumber + 1}</span>
            <ChevronRight />
          </div>
        )}
      </div>
    </div>
  );
}
