"use client";

import {
  PurchaseTableData,
  columns,
} from "@/components/purchases-table/columns";
import { PurchaseTable } from "@/components/purchases-table/purchaseTable";
import { User } from "@/db/schema";
import { getItemById, getUser, getUserPurchases } from "@/db/utils";
import { useEffect, useState } from "react";

/* 
  This PurchaseChart component is loaded on the client side and is responsible for retrieving 
  and displaying the purchases for a given seller.
*/
export default function PurchaseChart({ seller }: { seller: User }) {
  const [purchases, setPurchases] = useState<PurchaseTableData[]>([]); // The seller's purchases

  useEffect(() => {
    /* 
      Get the seller's purchases and update the purchases state variable.
    */
    getPurchaseTableData().then((purchases) => {
      setPurchases(purchases.filter((purchase) => purchase != null) as PurchaseTableData[]);
    });
  }, []);

  /*
    Get the seller's purchases and return the data in an array of `PurchaseTableData` objects.
  */
  const getPurchaseTableData = async (): Promise<
    (PurchaseTableData | null)[]
  > => {
    const purchases = await getUserPurchases(seller.username);
    return Promise.all(
      purchases.map(async (purchase) => {
        const item = await getItemById(purchase.itemId);
        const seller = await getUser(purchase.seller);

        if (item == null || seller == null) {
          return null;
        }

        return {
          id: purchase.id,
          itemId: item.id,
          title: item.title,
          image: item.image,
          sellerUsername: seller.username,
          sellerAddress: seller.username,
          quantity: purchase.quantity,
          totalPaid: purchase.quantity * item.price,
          timestamp: purchase.timestamp,
          status: purchase.status,
          txnDigest: purchase.txnDigest,
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center py-4 h-full">
      <PurchaseTable columns={columns} data={purchases} />
    </div>
  );
}
