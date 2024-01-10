"use client";

import { AlertTriangle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ItemCard from "../components/itemCard";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, Category, valueToCategory } from "@/lib/categories";
import { getItems } from "@/db/utils";
import { Item } from "@/db/schema";
import { SORTS, Sort, valueToSort } from "@/lib/sorting";
import { SessionProvider } from "next-auth/react";

/* 
  This is the main page of the marketplace app. It is responsible for rendering the list of all 
  available items. 
*/
export default function Home() {
  /* 
    State variables
  */
  const [items, setItems] = useState<Item[]>([]); // list of items to be displayed
  const [isLoading, setIsLoading] = useState(false); // whether the page is loading
  const [sorting, setSorting] = useState<Sort | null>(null); // the current sorting method
  const [category, setCategory] = useState<Category | null>(null); // the current category
  const [search, setSearch] = useState<string>(""); // the current search query
  const [pageNumber, setPageNumber] = useState(1); // the current page number
  const [pageSize] = useState(10); // the number of items to be displayed per page

  /* 
    TODO: Get the category and search query from the URL.
  */
  const categoryParam = null; // PLACEHOLDER
  const searchParam = null; // PLACEHOLDER

  /* 
    On page load, set the category and search query based on the URL.
  */
  useEffect(() => {
    /* 
      TODO: If the category param is set, set the category state variable to the corresponding category.
      Otherwise, leave the category state variable as null.
      HINT: Use the valueToCategory function to convert the category param to a Category object.
    */

    /* 
      TODO: If the search param is set, set the search state variable to the corresponding search query.
      Otherwise, leave the search state variable as an empty string.
    */
    
  }, []);

  /* 
    Whenever the category, search query, or sorting method changes, update the list of items to be
    displayed. This will also be done on page load.
  */
  useEffect(() => {
    // DO NOT MODIFY - This prevents the page from loading items before the category and search query
    if (categoryParam && !category) {
      return;
    }

    // DO NOT MODIFY - This prevents the page from loading items before the category and search query
    if (searchParam && !search) {
      return;
    }
    
    /*
      TODO: Set the isLoading state variable to true.
    */

    /* 
      TODO: Get the items from the database with the correct filters and sorting method. Then, update
      the items state variable and set the isLoading state variable to false.

      HINT: Filter for only listed items as well. 
    */
    
  }, [sorting, category, search]);

  return (
    <div className="bg-[#f4f7f7] flex flex-col gap-4 items-center py-4 ">
      <div className="w-full flex flex-row items-center justify-between gap-4 px-4">
        <div>
          {search && category !== null && (
            <div className="flex flex-row gap-2 items-center">
              <span className="text-gray-500">Search results for</span>
              <div>
                <span className="text-gray-700 font-semibold">{search}</span>
                <X
                  className="inline-block ml-2 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/?category=${category.value}`)
                  }
                />
              </div>
              <span className="text-gray-500">in</span>
              <div>
                <span className="text-gray-700 font-semibold">
                  {category.display}
                </span>
                <X
                  className="inline-block ml-2 cursor-pointer"
                  onClick={() => (window.location.href = `/?search=${search}`)}
                />
              </div>
            </div>
          )}
          {search && category === null && (
            <div className="flex flex-row gap-2 items-center">
              <span className="text-gray-500">Search results for</span>
              <div>
                <span className="text-gray-700 font-semibold">{search}</span>
                <X
                  className="inline-block ml-2 cursor-pointer"
                  onClick={() => (window.location.href = `/`)}
                />
              </div>
            </div>
          )}
          {!search && category !== null && (
            <div className="flex flex-row gap-2 items-center">
              <span className="text-gray-500">Showing all</span>
              <div>
                <span className="text-gray-700 font-semibold">
                  {category.display}
                </span>
                <X
                  className="inline-block ml-2 cursor-pointer"
                  onClick={() => (window.location.href = `/`)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
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
      {isLoading && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <span className="text-xl">Loading...</span>
        </div>
      )}
      {items.length === 0 && !isLoading && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <AlertTriangle className="w-16 h-16 text-yellow-400" />
          <span className="text-xl">No listings found</span>
        </div>
      )}
      <SessionProvider>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 h-full">
          {items
            .slice(pageSize * (pageNumber - 1), pageSize * pageNumber)
            .map((item, index) => (
              <ItemCard itemId={item.id} key={index} />
            ))}
        </div>
      </SessionProvider>
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
