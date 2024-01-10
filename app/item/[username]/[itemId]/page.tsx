import Image from "next/image";
import { AlertTriangle, Star } from "lucide-react";
import { getItemById, getNumberOfRatingsForTarget, getStarsForTarget } from "@/db/utils";
import { getUser } from "@/db/utils";
import ReviewListForTarget from "@/components/reviewListForTarget";
import PurchaseSection from "./purchaseSection";

/* 
  This is the page for displaying a single item. It is responsible for loading the item from the 
  database and displaying it.
*/
export default async function Product({
  params,
}: {
  params: { itemId: string; username: string };
}) {
  const { itemId, username: sellerUsername } = params; // itemId is the id of the item, username is the username of the seller

  const item = await getItemById(itemId);
  const stars = await getStarsForTarget(itemId);
  const seller = await getUser(sellerUsername);
  const ratingCount = await getNumberOfRatingsForTarget(itemId);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="w-16 h-16 text-yellow-400" />
        <span>Item not found</span>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle className="w-16 h-16 text-yellow-400" />
        <span>Seller not found</span>
      </div>
    );
  }
  return (
    <div className="flex flex-row gap-6 w-full p-6 items-start bg-white text-black">
      <div className="w-3/12 sticky top-6">
        <Image
          src={item.image}
          alt="Background Image"
          className="w-full"
          width={500}
          height={500}
        />
      </div>

      <div className="flex flex-col gap-3 w-6/12">
        <p className="text-2xl font-bold">{item.title}</p>
        <a
          href={`/seller/${sellerUsername}`}
          className="text-blue-500 hover:underline"
        >
          {`Visit ${sellerUsername}'s Store`}
        </a>
        <div className="flex flex-row items-center gap-3">
          {stars == null ? (
            <span className="w-full text-sm">No reviews yet</span>
          ) : (
            <div className="w-full text-md flex flex-row gap-2 items-center">
              <div className="text-md flex flex-row">
                {[1, 2, 3, 4, 5].map((i) => {
                  return (
                    <Star
                      key={i}
                      className={
                        i <= Math.round(stars)
                          ? "text-orange-500 fill-orange-500"
                          : "text-orange-500"
                      }
                    />
                  );
                })}
              </div>
              <span>{ratingCount} ratings</span>
            </div>
          )}
        </div>

        <p className="text-3xl font-semibold">${item.price}</p>
        <div className="border-t border-black/25 pt-3">
          <p className="text-lg font-semibold">Product description</p>
          <p className="pl-3 pt-3">{item.description}</p>
        </div>

        <div className="flex flex-col border-t border-black/25 pt-3 gap-3">
          <p className="text-lg font-semibold">Customer reviews</p>

          <ReviewListForTarget target={itemId} />
        </div>
      </div>

      <PurchaseSection
        itemId={itemId}
        sellerUsername={seller.username}
        available={item.availableSupply}
        listed={item.listed}
        itemTitle={item.title}
        itemImage={item.image}
        itemPrice={item.price}
      />
    </div>
  );
}