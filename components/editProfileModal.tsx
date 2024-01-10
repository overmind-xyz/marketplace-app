"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getUser, updateUser } from "@/db/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { User } from "@/db/schema";
import { getSession } from "next-auth/react";

/* 
  This component is responsible for rendering the edit profile modal. It is displayed when the user
  edits their profile.
*/
export default function EditProfileModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null); // The current user
  const [loading, setLoading] = useState<boolean>(false); // Whether the submission is loading
  const [success, setSuccess] = useState<boolean>(false); // Whether the listing was successfully created
  
  const [password, setPassword] = useState(""); // The password of the user
  const [bio, setBio] = useState(""); // The bio of the user
  const [profilePic, setProfilePic] = useState(""); // The profile picture of the user
  const [shippingAddress, setShippingAddress] = useState(""); // The shipping address of the user

  /* 
    On page load, get the current user.
  */
  useEffect(() => {
    /*
      TODO: Get the current session, and if the user is logged in, get the user from the database and
      update the user state, bio state, profilePic state, shippingAddress state, and password state.
    */

  }, []);

  /* 
    TODO: Implement the onSubmit function. This function should update the user in the database and 
    update the user state with the new information.
  */
  const onSubmit = async () => {
    
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profilePic" className="text-right">
              Profile Picture
            </Label>
            <Input
              id="profilePic"
              value={profilePic}
              onChange={(e: any) => {
                setProfilePic(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e: any) => {
                setBio(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Shipping address
            </Label>
            <Input
              id="shippingAddress"
              value={shippingAddress}
              onChange={(e: any) => {
                setShippingAddress(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Password
            </Label>
            <Input
              id="shippingAddress"
              value={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={loading}
            onClick={onSubmit}
          >
            {loading ? "Saving..." : success ? "Saved!" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
