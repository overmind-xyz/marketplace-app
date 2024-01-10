"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { CartItem } from "@/lib/cart";

export default function CartButton() {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    function handleCartChange() {
      const cart = localStorage.getItem("cart") ?? "[]";
      try {
        const parsedCart = JSON.parse(cart);
        setCartItems(parsedCart);
      } catch (err) {}
    }

    handleCartChange();

    window.addEventListener("cartUpdated", handleCartChange);
    return () => window.removeEventListener("cartUpdated", handleCartChange);
  }, []);

  return (
    <Button
      variant="outline"
      className="relative"
      onClick={() => {
        window.location.href = "/cart";
      }}
    >
      <ShoppingCartIcon className="w-5 h-5" />
      {cartItems && cartItems.length >= 1 && (
        <span className="flex bg-red-400 rounded-full absolute w-3 h-3 top-[7px] right-[8px] text-[9px] items-center text-center justify-center p-[1px]">
          {cartItems.length}
        </span>
      )}
    </Button>
  );
}
