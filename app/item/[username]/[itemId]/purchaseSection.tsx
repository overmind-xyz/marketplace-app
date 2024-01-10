"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/db/schema";
import {
  addItemToWatchList,
  getUser,
  isUserWatchingItem,
  purchaseItem,
  removeItemFromWatchList,
  unlistItem,
} from "@/db/utils";
import { CartItem } from "@/lib/cart";
import { UserStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

/* 
  This is the purchase section of the item page. It is loaded on the client side and is responsible
  for handling the purchase of the item.
*/
export default function PurchaseSection({
  itemId, // The id of the item
  sellerUsername, // The username of the seller of the item
  available, // The quantity of the item available for purchase
  listed, // Whether the item is listed (1) or not (0). 
  itemTitle, // The title of the item
  itemImage, // The image of the item
  itemPrice, // The price of the item
}: {
  itemId: string;
  sellerUsername: string;
  listed: 0 | 1;
  available: number;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
}) {
  const { toast } = useToast(); // The toast hook

  const [user, setUser] = useState<User | null>(null); // The current user
  const [userStatus, setUserStatus] = useState(UserStatus.Visitor); // The status of the current user (seller, buyer, or visitor)
  const [quantity, setQuantity] = useState<string>("1"); // The quantity of the item to be purchased
  const [loading, setLoading] = useState(false); // Whether the page is loading
  const [error, setError] = useState(""); // The error message to be displayed
  const [success, setSuccess] = useState(""); // The success message to be displayed
  const [isWatched, setIsWatched] = useState(false); // Whether the item is in the user's watch list

  /* 
    On page load, get the current user and update the state variables that are dependent on the user.
  */
  useEffect(() => {
    /* 
      TODO: Update the following state variables: 
        - user
        - userStatus
        - isWatched

      HINT: Get the logged in user's session and then get the user from the database to update the 
            user state variable. Then, check if the user is the seller of the item to update the 
            userStatus state variable. Finally, check if the user is watching the item to update the 
            isWatched state variable.
    */
    
  }, []);

  /* 
    Purchases the item immediately.
  */
  const onBuyNow = async () => {
    /*
      TODO: Add a check to see if the user is logged in and is the buyer of the item
      If not, return
    */

    /*
      TODO: Set loading to true
    */

    /*
      TODO: Parse the quantity state variable to ensure that it is a valid integer
      If not, set error to "Invalid quantity!", set loading to false, and return
    */

    /*
      TODO: Call the purchaseItem function
    */

    /*
      TODO: Set success to "Purchase successful!"
    */
    
    /*
      TODO: Set loading to false
    */

    /*
      TODO: Redirect the user to the purchases tab of their profile page
    */

  };

  /* 
    Adds the item to the user's cart.
  */
  const onAddToCart = async () => {
    /*
      TODO: Add a check to see if the user is logged in and is the buyer of the item
      If not, return
    */

    /*
      TODO: Retrieve the cart from local storage and parse it into a CartItem array
    */

    /*
      TODO: Parse the quantity state variable to ensure that it is a valid integer
      If not, set error to "Invalid quantity!", set loading to false, and return
    */

    /*
      TODO: If the item is already in the cart, increment the quantity of the item in the cart, 
      otherwise, add the item to the cart
    */

    /*
      TODO: Stringify the cart and set it in local storage
    */

    /*
      TODO: Dispatches an event to update the cart icon in the navbar and displays a toast
      HINT: Dispatch an event with the name "cartUpdated"
    */

  };

  /* 
    Unlists the item, making it unavailable for purchase. This can only be done by the seller.
  */
  const onRemoveListing = async () => {
    /*
      TODO: Add a check to see if the user is logged in and is the seller of the item
      If not, return
  */

    /*
      TODO: Set loading to true
    */

    /*
      TODO: Call the unlistItem function
    */

    /*
      TODO: Set success to "Listing removed!"
    */

    /*
      TODO: Set loading to false
    */

    /*
      TODO: Redirect the user to their profile page
    */

  };

  /*
    TODO: Render a different UI depending on the user's status (seller, buyer, or visitor)

    - Seller: If the user is the seller of the item, display a button to remove the listing. Use the 
              UI provided below: 
              ```
              <Card className="items-center p-6 flex flex-col gap-3 w-3/12 sticky top-6">
                <Button
                  disabled={loading || listed == 0}
                  className="w-full"
                  variant="destructive"
                  onClick={onRemoveListing}
                >
                  {loading
                    ? "Loading..."
                    : success
                    ? success
                    : error
                    ? error
                    : listed == 1
                    ? "Remove listing"
                    : "Listing removed"}
                </Button>
              </Card>
              ```
    - Buyer: If the user is the buyer of the item, display buttons to buy the item, add it to the 
              cart, and add it to the watch list. Use the UI provided below: 
              ```
              <Card className="items-center p-6 flex flex-col gap-3 w-3/12 sticky top-6">
                <div className="flex flex-col items-center w-full gap-4">
                  <div className="flex justify-center flex-col items-start w-full">
                    <p className="text-3xl font-semibold">${itemPrice}</p>
                    <p
                      className={cn(
                        `text-xl font-semibold`,
                        available === 0 ? "text-red-600" : "text-green-600"
                      )}
                    >
                      {available === 0 ? "Out of Stock" : "In Stock"}
                    </p>
                  </div>

                  <div className="w-full flex flex-row items-center justify-start gap-4">
                    <Label htmlFor="username" className="text-center text-lg">
                      Qty:
                    </Label>
                    <Input
                      id="username"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                      type="number"
                      className={
                        "w-[90px] bg-white flex flex-row items-center border border-black/25 rounded py-2 px-3 space-x-2" +
                        `${
                          isNaN(parseInt(quantity)) || parseInt(quantity) > available
                            ? " text-red-500"
                            : ""
                        }`
                      }
                    />
                  </div>
                  <Button
                    disabled={loading || available == 0 || listed == 0}
                    className="w-full font-medium bg-[#FFA41C] text-black hover:bg-[#FFB41C]"
                    onClick={onBuyNow}
                  >
                    {loading
                      ? "Loading..."
                      : success
                      ? success
                      : error
                      ? error
                      : available == 0
                      ? "Out of stock"
                      : listed == 1
                      ? "Buy now"
                      : "Item not available"}
                  </Button>
                  <Button
                    disabled={loading || available == 0 || listed == 0}
                    className="w-full font-medium bg-[#FFD813] text-black hover:bg-[#FFE813]"
                    onClick={onAddToCart}
                  >
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    {loading
                      ? "Loading..."
                      : success
                      ? success
                      : error
                      ? error
                      : available == 0
                      ? "Out of stock"
                      : listed == 1
                      ? "Add to cart"
                      : "Item not available"}
                  </Button>
                  <div className="py-2 w-full">
                    <div className="bg-black/50 w-full h-px" />
                  </div>
                  {isWatched ? (
                    <Button
                      disabled={loading || available == 0 || listed == 0}
                      variant="outline"
                      className="w-full font-medium  rounded-lg text-black "
                      onClick={() => {
                        if (!user) {
                          return;
                        }
                        removeItemFromWatchList(user.username, itemId);
                        setIsWatched(false);
                      }}
                    >
                      Remove from Watch List
                    </Button>
                  ) : (
                    <Button
                      disabled={loading || available == 0 || listed == 0}
                      className="w-full font-medium bg-white border border-black/50 py-3 rounded-full text-black hover:bg-white"
                      onClick={() => {
                        if (!user) {
                          return;
                        }
                        addItemToWatchList(user.username, itemId);
                        setIsWatched(true);
                      }}
                    >
                      Add to Watch List
                    </Button>
                  )}
                </div>
              </Card>
              ```
    - Visitor: If the user is not logged in, display a button telling them to log in. Use the UI 
                provided below: 
                ```
                <Card className="items-center p-6 flex flex-col gap-3 w-3/12 sticky top-6">
                  <Button disabled variant="outline" className="w-full">
                    Log in to purchase
                  </Button>
                </Card>
                ``` 
  */
}
