"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Rating, User } from "@/db/schema";
import {
  getReviewByTargetAndAuthor,
  getUser,
  submitReview,
  updateReview,
} from "@/db/utils";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

/* 
  This is the rate seller page. It is responsible for allowing the user to rate a seller.
*/
export default function RateSellerPage({
  params,
}: {
  params: { username: string };
}) {
  const { username: sellerUsername } = params; // The username of the seller to rate

  const [user, setUser] = useState<User | null>(null); // The current user
  const [seller, setSeller] = useState<User | null>(null); // The seller to rate
  const [rating, setRating] = useState(3); // The rating to give the seller
  const [comment, setComment] = useState(""); // The comment to give the seller
  const [loading, setLoading] = useState(false); // Whether the page is loading
  const [error, setError] = useState(""); // The error message to display
  const [review, setReview] = useState<Rating | null>(null); // The review to update (if it exists)

  /* 
    On page load and whenever the seller changes, get the current user and the review (if it exists).
  */
  useEffect(() => {
    getSession().then((session) => {
      if (session && session.user?.name) {
        getUser(session.user.name).then((user) => {
          setUser(user);
          getReviewByTargetAndAuthor(sellerUsername, user.username).then((review) => {
            if (review != null) {
              setReview(review);
              setRating(review.stars);
              setComment(review.comment);
            }
          });
        });
      }
    });
  }, [seller]);

  /*
    On page load and when the sellerUsername changes, get the seller.
  */
  useEffect(() => {
    getUser(sellerUsername).then((seller) => {
      setSeller(seller);
    });
  }, [sellerUsername]);    

  /*
    Submits the review to the database or updates the existing one.
  */
  const onSubmit = async () => {
    if (user == null) return;

    setLoading(true);

    let res;
    if (review == null) {
      res = await submitReview({
        comment: comment,
        stars: rating,
        target: sellerUsername,
        author: user.username,
      });
    } else {
      res = await updateReview(review.id, {
        comment: comment,
        stars: rating,
      });
    }

    if (res.changes && res.changes > 0) {
      window.location.href = `/seller/${sellerUsername}`;
    } else {
      setError("Something went wrong. Try again.");
    }
  };

  if (user == null) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        Log in
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create your review</CardTitle>
          <CardDescription>
            Write your review for the seller below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex flex-col w-full gap-2">
            <span className="text-lg">Seller</span>
            <a
              href={`/seller/${sellerUsername}`}
              className="flex flex-row justify-start items-center gap-4 ps-4 rounded-xl rounded-lg border p-2"
            >
              <img
                src={seller?.profilePic}
                className="w-12 h-12 rounded-xl border"
              />
              <span className="text-sm underline">{seller?.username}</span>
            </a>
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-row gap-2 items-baseline">
              <span className="text-lg">Rating:</span>
              <span
                className={
                  "text-lg " +
                  (rating < 2
                    ? "text-red-500"
                    : rating < 4
                    ? "text-yellow-500"
                    : "text-green-500")
                }
              >
                {rating} stars
              </span>
            </div>
            <Slider
              className="w-full"
              min={0}
              max={5}
              step={1}
              value={[rating]}
              onValueChange={(value) => {
                setRating(value[0]);
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <span>Additional comments</span>
            <Textarea
              className="w-full"
              placeholder="I love this item..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button disabled={loading} className="w-full" onClick={onSubmit}>
            {loading
              ? "Submitting..."
              : error != ""
              ? error
              : review != null
              ? "Update review"
              : "Submit review"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
