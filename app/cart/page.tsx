"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CartItem } from "@/lib/cart";
import { Input } from "@/components/ui/input";
import { getUser, purchaseItem } from "@/db/utils";
import { Button } from "@/components/ui/button";
import { User } from "@/db/schema";
import { getSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCartIcon } from "lucide-react";

/* 
  This is the cart page. It is responsible for displaying the items in the cart, and allowing the 
  user to checkout and purchase the items in the cart.
*/
export default function Cart() {
  const [user, setUser] = useState<User | null>(null); // The current user
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // The items in the card
  const [cartCheckoutLoading, setCartCheckoutLoading] =
    useState<boolean>(false); // Whether the cart is currently checking out

  /*
    On page load, get the cart items from local storage.
  */
  useEffect(() => {
    /*
      TODO: Get the cart items from local storage
    */

    /*
      TODO: Parse the cart items as a CartItem array and update the cart items state
    */

  }, []);

  /*
    On page load, get the current user.
  */
  useEffect(() => {
    /*
      TODO: Get the current user from the session and update the user state
    */

  }, []);

  /*
    Dispatches an event to the window whenever the cart items change.
  */
  useEffect(() => {
    /* 
      TODO: Dispatch an event to the window whenever the cart items change. 
      HINT: Dispatch an event with the name "cartUpdated"
    */

  }, [cartItems]);

  /*
    This function is called when the user clicks the checkout button. It is responsible for 
    purchasing the items in the cart. 
  */
  const onCheckout = async () => {
    // TODO: If there is no user logged in, return


    // TODO: Get the cart items from local storage

    // TODO: Parse the cart items as a CartItem array

    // TODO: Set the cart checkout loading state to true

    
    /* 
      TODO: For each item in the cart, purchase the item using the purchaseItem function. Once all 
            items have been purchased, set the cart checkout loading state to false, empty the cart 
            in local storage, and redirect the user to their purchases page. 
    */
    
  };

  /*
    This is the cart card component. It is responsible for displaying a single item in the cart.
  */
  const CartCard = ({ title, quantity, price, image, id }: CartItem) => {
    return (
      <div className="bg-white p-6 flex flex-row gap-6">
        <Image
          src={image}
          alt="Background Image"
          className="shrink-0"
          width={160}
          height={160}
        />
        <div className="flex flex-col gap-3">
          <p className="text-xl font-medium">{title}</p>
          <div className="flex flex-row gap-6 items-center">
            <div className="flex">
              <div className="flex flex-row items-center border border-black/25 rounded py-2 px-3 space-x-2">
                <p className="">Qty:</p>
                <Input
                  className="w-20 h-8 bg-white border-0"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const index = cartItems.findIndex((item) => item.id === id);
                    const updatedCartItems = [
                      ...cartItems.slice(0, index),
                      {
                        ...cartItems[index],
                        quantity: Number(e.target.value),
                      },
                      ...cartItems.slice(index + 1, cartItems.length),
                    ];
                    setCartItems(updatedCartItems);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify(updatedCartItems)
                    );
                  }}
                />
              </div>
            </div>
            <p
              className="text-blue-500 hover:underline hover:cursor-pointer"
              onClick={() => {
                const itemIndex = cartItems.findIndex((item) => item.id === id);

                if (itemIndex !== -1) {
                  const deletedItemFromCart = [
                    ...cartItems.slice(0, itemIndex),
                    ...cartItems.slice(itemIndex + 1, cartItems.length),
                  ];
                  setCartItems(deletedItemFromCart);
                  localStorage.setItem(
                    "cart",
                    JSON.stringify(deletedItemFromCart)
                  );
                }
              }}
            >
              Delete
            </p>
          </div>
        </div>

        <p className="text-xl font-medium">${(quantity * price).toLocaleString()}</p>
      </div>
    );
  };

  return (
    <>
      <main className="bg-[#f4f7f7] p-6 text-black h-full">
        <div className="flex flex-row gap-6 items-start">
          <Card className="bg-white p-6 w-9/12">
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="text-3xl font-medium flex items-center ">
                  <ShoppingCartIcon className="inline mr-4 w-8 h-8" />
                  Shopping Cart
                </div>
                <div className="bg-black/25 rounded w-full h-px" />
                <div className="grid grid-cols-1">
                  {!cartItems ||
                    (cartItems.length === 0 && <p>No items in cart</p>)}
                  {cartItems.map((item) => (
                    <CartCard key={item.id} {...item}></CartCard>
                  ))}
                </div>
                {cartItems && cartItems.length >= 1 && (
                  <div className="border-t border-black/25 pt-6 flex items-end gap-2 justify-end">
                    <p className="text-2xl font-medium">
                      Subtotal ({cartItems.length} item
                      {cartItems && cartItems.length >= 2 ? "s" : ""}
                      ):
                    </p>
                    <p className="text-2xl font-bold">
                      {" "}
                      $
                      {cartItems
                        .reduce<number>(
                          (acc, curr) => acc + curr.quantity * curr.price,
                          0
                        )
                        .toLocaleString()}{" "}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white p-6 w-3/12 sticky top-6">
            <CardContent>
              <div className="flex flex-col gap-6 ">
                {cartItems && cartItems.length >= 1 && (
                  <>
                    <p className="text-2xl font-medium">
                      Subtotal ({cartItems.length} item
                      {cartItems && cartItems.length >= 2 ? "s" : ""})
                      <span className="font-bold block">
                        {" "}
                        $
                        {cartItems
                          .reduce<number>(
                            (acc, curr) => acc + curr.quantity * curr.price,
                            0
                          )
                          .toLocaleString()}{" "}
                      </span>
                    </p>

                    <Button
                      className="w-full font-medium bg-[#FFD813]  hover:bg-[#FFE813] text-black"
                      onClick={onCheckout}
                      disabled={cartCheckoutLoading || !user}
                    >
                      Checkout
                    </Button>
                  </>
                )}
                {!cartItems ||
                  (cartItems.length === 0 && (
                    <a
                      href="/"
                      className="flex items-center justify-center w-full font-medium bg-[#FFD813] py-3 rounded-full hover:bg-[#FFD813]"
                    >
                      Visit Shop
                    </a>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
