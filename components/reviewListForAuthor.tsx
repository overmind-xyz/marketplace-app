"use client";

import { getReviewsFromAuthor, getUser } from "@/db/utils";
import { useEffect, useState } from "react";
import { Rating, User } from "@/db/schema";
import ReviewCard from "@/components/reviewCard";
import { getSession } from "next-auth/react";

export default function ReviewListForAuthor({ author }: { author: string }) {

  const [reviews, setReviews] = useState<Rating[]>([]); // The reviews for the author
  const [loading, setLoading] = useState(true); // Whether the page is loading

  /* 
    On page load, get the reviews for the author.
  */
  useEffect(() => {
    /* 
      TODO: Set loading to true.
    */
    
    /*
      TODO: Get the reviews from the author and update the reviews state.
    */

  }, [author]);

  /*
    TODO: If the page is loading, display the provided loading message.
    ```
    <div className="flex flex-col gap-4 items-center py-4 h-full">
      <span className="text-2xl text-gray-500">Loading...</span>
    </div>
    ```
  */

  /*
    TODO: If there are no reviews, display a message saying so.
    ```
    <div className="flex flex-col gap-4 items-center py-4 h-full">
      <span className="text-2xl text-gray-500">No reviews yet</span>
    </div>
    ```
  */

  /*
    TODO: Otherwise, display the reviews. 
  */
  return (
    <div className="flex flex-col gap-4 items-center py-4 h-full w-full">
      {
        /* 
          TODO: Map through each of the reviews and display a ReviewCard component for each one.
        */
        "PLACEHOLDER"
      }
    </div>
  );
}
