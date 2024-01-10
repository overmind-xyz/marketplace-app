"use client";

import { useEffect, useState } from "react";
import { getItemById, getUser, getUserSales } from "@/db/utils";
import { PurchaseTable } from "@/components/purchases-table/purchaseTable";
import { SaleTableData, columns } from "@/components/sales-table/columns";
import { User } from "@/db/schema";
import { SaleTable } from "@/components/sales-table/saleTable";

export default function SaleChart({ seller }: { seller: User }) {
  const [sales, setSales] = useState<SaleTableData[]>([]); // The seller's sales

  useEffect(() => {
    /*
      Get the seller's sales and update the sales state variable.
    */
    getSaleTableData().then((sales) => {
      setSales(sales.filter((sale) => sale != null) as SaleTableData[]);
    });
  }, []);

  /* 
    Get the seller's sales and return the data in an array of `SaleTableData` objects.
  */
  const getSaleTableData = async (): Promise<(SaleTableData | null)[]> => {
    const purchases = await getUserSales(seller.username);
    return Promise.all(
      purchases.map(async (sale) => {
        const item = await getItemById(sale.itemId);
        const buyer = await getUser(sale.buyer);
        const seller = await getUser(sale.seller);

        if (item == null || seller == null) {
          return null;
        }

        return {
          id: sale.id,
          itemId: item.id,
          title: item.title,
          image: item.image,
          buyerUsername: buyer.username,
          sellerUsername: seller.username,
          quantity: sale.quantity,
          totalPaid: sale.quantity * item.price,
          timestamp: sale.timestamp,
          status: sale.status,
          txnDigest: sale.txnDigest,
          buyerShippingAddress: buyer.shippingAddress,
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center py-4 h-full">
      <SaleTable columns={columns} data={sales} />
    </div>
  );
}
