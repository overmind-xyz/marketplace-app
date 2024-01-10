"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getUser,
  getUserShopBalance,
  withdrawBalanceFromShop,
} from "@/db/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/* 
  This WithdrawModal component is loaded on the client side and is responsible for withdrawing
  the balance from the shop.
*/
export default function WithdrawModal() {
  
  const [showDialog, setShowDialog] = useState<boolean>(false); // Whether the dialog is shown
  const [loading, setLoading] = useState<boolean>(true); // Whether the submission is loading
  const [success, setSuccess] = useState<boolean>(false); // Whether the withdrawal was successfully created
  const [error, setError] = useState<boolean>(false); // Whether there was an error withdrawing the balance
  const [amount, setAmount] = useState<string>("0"); // The amount of balance in the shop
 
  const { data: session } = useSession(); // The current session

  /*
    On page load, get the current user and the amount of balance in the shop.
  */
  useEffect(() => {
    /* 
      TODO: Get the withdraw URL query parameter, and if it exists, set the showDialog state to true.
    */

    /* 
      TODO: If the session exists and the user is logged in, get the user from the database and
      use the user's balance to update the balance state.
    */

  }, [session]);

  /* 
    Withdraw the balance from the shop.
  */
  const onWithdraw = async () => {
    /* 
      TODO: Set loading to true.
    */

    /*
      TODO: Return if the session or the session name does not exist.
    */


    /* 
      TODO: Get the user from the database, and if the user does not exist, set error to true and return.
    */

    /* 
      TODO: Withdraw the balance from the shop and set success to true.
    */


    /* 
      TODO: Remove the withdraw URL query parameter from the URL and set showDialog to false.
    */

  };

  return (
    <Dialog open={showDialog}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Withdraw Sui from your shop</DialogTitle>
          <DialogDescription>
            {amount === "0" ? (
              "You have nothing to withdraw from your shop. Please create a listing to earn."
            ) : (
              <span>
                You have <span className="text-green-500">${amount}</span> in
                your shop. Click the button below to withdraw it.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => {
              window.history.replaceState(null, "", window.location.pathname); // remove URL fragment
              setShowDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onWithdraw}
            disabled={loading || amount === "0"}
          >
            {loading
              ? "Loading..."
              : success
              ? "Success!"
              : error
              ? "Error - please try again"
              : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
