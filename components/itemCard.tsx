"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Item, User } from "@/db/schema";
import { useEffect, useState } from "react";
import {
  addItemToWatchList,
  getItemById,
  getUser,
  isUserWatchingItem,
  removeItemFromWatchList,
} from "@/db/utils";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";

/* 
  This component is responsible for rendering the item card.
*/
export default function ItemCard({ itemId }: { itemId: string }) {
  const [user, setUser] = useState<User | null>(null); // The current user
  const [item, setItem] = useState<Item | null>(null); // The current item
  const [isWatched, setIsWatched] = useState(false); // Whether the item is on the user's watch list

  const { data: session } = useSession(); // The current session

  /* 
    On page load, get the current item and user.
  */
  useEffect(() => {
    /* 
      TODO: Get the current item and user, and if the user is logged in, check if the item is on the 
      user's watch list. Update the item, user, and isWatched states.
    */
    
  }, [itemId, session]);

  /* 
    If the item is null, return an empty fragment (`<></>`).
  */

  /* 
    TODO: Otherwise, return the following UI: 
    ```
    <a href={`/item/${item.owner}/${item.id}`}>
      <Card className="hover:scale-105 transform transition duration-300 ">
        <CardHeader className="px-0 py-0">
          <CardTitle>
            {" "}
            <Image
              src={item.image}
              alt={item.title}
              className="rounded-t-md object-cover w-[240px] h-[240px]"
              width={240}
              height={240}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="hover:underline text-blue-500 font-medium hover:cursor-pointer text-sm">
            {item.title}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-row justify-between items-center gap-2">
            <p className="text-xl font-medium">${item.price}</p>
            {isWatched ? (
              <Star
                className="text-blue-500"
                size={24}
                onClick={async (e) => {
                  e.preventDefault();
                  if (user !== null) {
                    await removeItemFromWatchList(user.username, item.id);
                    setIsWatched(false);
                  }
                }}
              />
            ) : (
              <Star
                className="text-gray-500"
                size={24}
                onClick={async (e) => {
                  e.preventDefault();
                  if (user !== null) {
                    await addItemToWatchList(user.username, item.id);
                    setIsWatched(true);
                  }
                }}
              />
            )}
          </div>
        </CardFooter>
      </Card>
    </a>
    ```
  */

  return <></>; // PLACEHOLDER
}
