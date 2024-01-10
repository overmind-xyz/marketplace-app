"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { createUser, getUser, getUserShopBalance } from "@/db/utils";
import { User } from "@/db/schema";
import { Loader, Loader2 } from "lucide-react";

/* 
  This component is responsible for rendering the profile button.
*/
export default function ProfileButton() {
  const [user, setUser] = useState<User | null>(null); // The current user
  const [showModal, setShowModal] = useState(false); // Whether the modal is shown or not
  const [usernameInput, setUsernameInput] = useState(""); // The username input
  const [passwordInput, setPasswordInput] = useState(""); // The password input
  const [secondPasswordInput, setSecondPasswordInput] = useState(""); // The second password input
  const [shopBalance, setShopBalance] = useState<string>("0"); // The shop balance of the user

  const { data: session, status } = useSession(); // The current session

  /* 
    On page load, get the current user.
  */
  useEffect(() => {
    /* 
      TODO: If the session exists and the user is logged in, get the user from the database and update
      the user state. Then, get the user's shop balance and update the shop balance state.
    */
    
  }, [session]);

  /* 
    Sign up the user for the first time.
  */
  const onSignUp = async () => {
    /* 
      TODO: Create the user
    */

    /*
      TODO: Sign in the newly created user 
    */

  };

  /* 
    TODO: If the user is not logged in (unauthenticated), return the provided UI below: 
    ```
    <div>
      <Button
        className="bg-[#194D47] hover:bg-[#2D6E56]"
        onClick={() => setShowModal(true)}
      >
        Connect
      </Button>
      <Dialog open={showModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[455px]">
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Log in</TabsTrigger>
              <TabsTrigger value="password">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Log in</CardTitle>
                  <CardDescription>
                    Log into your account here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">username</Label>
                    <Input
                      id="name"
                      placeholder="jsmith"
                      value={usernameInput}
                      onChange={(e) => {
                        setUsernameInput(e.currentTarget.value);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password123"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.currentTarget.value);
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() =>
                      signIn("credentials", {
                        username: usernameInput,
                        password: passwordInput,
                      })
                    }
                  >
                    Log in
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Create your new marketplace account.</CardTitle>
                  <CardDescription>
                    Enter your username and password below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">username</Label>
                    <Input
                      id="name"
                      placeholder="jsmith"
                      value={usernameInput}
                      onChange={(e) => {
                        setUsernameInput(e.currentTarget.value);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password123"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.currentTarget.value);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Confirm password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password123"
                      value={secondPasswordInput}
                      onChange={(e) => {
                        setSecondPasswordInput(e.currentTarget.value);
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={
                      passwordInput !== secondPasswordInput ||
                      passwordInput.length < 8 ||
                      usernameInput.length < 3
                    }
                    onClick={onSignUp}
                  >
                    Sign up
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
    ```
  */

  /* 
    If the user is loading or the user is null, return the provided loading UI below:
    ```
    <Button className="font-mono bg-[#194D47] hover:bg-[#2D6E56]">
      <Loader2 className="animate-spin" />
    </Button>
    ```   
  */

  /* 
    Otherwise, return this UI: 
    ```
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="font-mono bg-[#194D47] hover:bg-[#2D6E56]">
            {user.username}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <a href={`/seller/${user.username}?withdraw=true`}>
            <DropdownMenuItem>
              <span>${shopBalance} (click to withdraw)</span>
            </DropdownMenuItem>
          </a>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <a href={`/seller/${user.username}`}>
            <DropdownMenuItem>
              <span>View Profile</span>
            </DropdownMenuItem>
          </a>
          <DropdownMenuItem onClick={async () => await signOut()}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    ```
  */

  return <></>;
}
