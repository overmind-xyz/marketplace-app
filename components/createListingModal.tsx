"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addNewItem, getUser } from "@/db/utils";
import { CATEGORIES, Category, valueToCategory } from "@/lib/categories";
import { Textarea } from "./ui/textarea";
import { DollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "@/db/schema";

/* 
  This component is responsible for rendering the create listing modal. It is displayed when the user
  clicks the "Sell" button in the header.
*/
export default function CreateListingModal() {
  const [user, setUser] = useState<User | null>(null); // The current user
  const [name, setName] = useState<string>(""); // The name of the listing
  const [description, setDescription] = useState<string>(""); // The description of the listing
  const [listingPrice, setListingPrice] = useState<string>(""); // The price of the item
  const [url, setUrl] = useState<string>(""); // The image URL of the listing
  const [quantity, setQuantity] = useState<string>("1"); // The quantity of the listing
  const [category, setCategory] = useState<Category | null>(null); // The category of the listing
  const [loading, setLoading] = useState<boolean>(false); // Whether the submission is loading
  const [success, setSuccess] = useState<boolean>(false); // Whether the listing was successfully created
  const [error, setError] = useState<boolean>(false); // Whether there was an error creating the listing

  const { data: session, status } = useSession(); // The current session
  
  /* 
    On page load, get the current user.
  */
  useEffect(() => {
    /* 
      TODO: If the session exists and the user is logged in, get the user from the database and 
      update the user state.
    */

  }, [session]);

  /* 
    When the user clicks submit, create the listing.
  */
  const onCreateListing = async () => {

    /* 
      TODO: If the user is not logged in, return.
    */

    
    /*
      TODO: Set loading to true.
    */


    /* 
      TODO: Parse the quantity and listing price as an integer and float, respectively. If either is 
      invalid, set error to true and return.
    */


    /* 
      TODO: Add the new item to the database. 
      HINT: Create a new id for the item using Math.random().toString(36).substring(7)
    */

    /*
      TODO: Set loading to false and success to true.
    */


    /* 
      TODO: Clear the form fields.
    */


    /* 
      TODO: Redirect the user to their page with the listings tab selected.
    */

  };

  /*
    If the user is not logged in or the session is loading, return an empty fragment (<></>).
  */
  if (!user || status === "loading") {
    return <></>;
  }
  
  /* 
    Otherwise, return the following UI:
  */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <DollarSign className="h-4 w-4 mr-1" />
          Sell
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create a new listing</DialogTitle>
          <DialogDescription>
            Enter all of the details for your new listing. Click submit to
            create the listing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Textarea
              id="username"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Listing price
            </Label>
            <Input
              id="username"
              value={listingPrice}
              onChange={(e) => {
                setListingPrice(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Image URL
            </Label>
            <Input
              id="username"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Quantity
            </Label>
            <Input
              id="username"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Category
            </Label>
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
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder="Select a category"
                  defaultValue="Select a category"
                />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={onCreateListing}
            disabled={loading || !user}
          >
            {!user
              ? "Connect wallet to sell stuff!"
              : loading
              ? "Loading..."
              : success
              ? "Success!"
              : error
              ? "Error - please try again"
              : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
